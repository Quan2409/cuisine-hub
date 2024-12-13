const postModal = require("../models/post-model");
const userModal = require("../models/user-model");
const commentModal = require("../models/comments-model");

const postController = {
  // creat-post
  createPost: async (req, res, next) => {
    const { userId } = req.body.user;
    const { content, media } = req.body;

    try {
      if (!content) {
        return res.status(400).json({
          status: false,
          message: "Enter some content, pleas,...",
        });
      }
      const post = await postModal.create({
        userId,
        content,
        media,
        createdAt: Date.now(),
      });
      return res.status(201).json({
        status: true,
        message: "Post is created",
        data: post,
      });
    } catch (error) {
      return res.status(404).json({
        status: false,
        message: error.message,
      });
    }
  },

  // get all posts
  getAllPosts: async (req, res) => {
    try {
      const posts = await postModal
        .find({})
        .populate({
          path: "userId",
          select: "firstName lastName location profession avatar -password",
        })
        .sort({ _id: -1 });

      return res.status(200).json({
        status: true,
        message: "All posts response",
        data: posts,
      });
    } catch (error) {
      return res.status(404).json({
        message: error.message,
      });
    }
  },

  // search-post
  searchPost: async (req, res) => {
    const { userId } = req.body.user;
    const { search } = req.body;

    try {
      let searchQuery = {};
      if (search) {
        // create condition to search based on user information
        const users = await userModal
          .find({
            $or: [
              { firstName: { $regex: search, $options: "i" } },
              { lastName: { $regex: search, $options: "i" } },
              { location: { $regex: search, $options: "i" } },
              { profession: { $regex: search, $options: "i" } },
            ],
          })
          .select("_id");

        const userIdsToSearch = users.map((user) => user._id.toString());

        // create condition to search based on post content
        searchQuery = {
          $or: [
            { content: { $regex: search, $options: "i" } },
            { userId: { $in: userIdsToSearch } },
          ],
        };
      } else if (search === "") {
        res.status(404).json({
          status: false,
          mesage: "Enter some search term",
        });
      }

      // search post
      const posts = await postModal
        .find(searchQuery)
        .populate({
          path: "userId",
          select: "firstName lastName location profession avatar -password",
        })
        .sort({ _id: -1 });

      return res.status(200).json({
        status: true,
        message: "Search query result: ",
        data: posts,
      });
    } catch (error) {
      return res.status(404).json({
        message: error.message,
      });
    }
  },

  // get post by id
  getPostById: async (req, res) => {
    const { id } = req.params;
    try {
      const isPostExits = await postModal.findById(id).populate({
        path: "userId",
        select: "firstName lastName location, avatar -password",
      });

      if (isPostExits) {
        return res.status(200).json({
          status: true,
          message: "Post Information: ",
          data: isPostExits,
        });
      } else {
        return res.status(404).json({
          status: false,
          message: "Post Not Found",
        });
      }
    } catch (error) {
      return res.status(404).json({
        message: error.message,
      });
    }
  },

  // get user's post
  getUserPosts: async (req, res) => {
    const { id } = req.params;
    try {
      const isPostExits = await postModal
        .find({ userId: id })
        .populate({
          path: "userId",
          select: "firstName lastName location avatar -password",
        })
        .sort({ _id: -1 });

      if (isPostExits) {
        const userPosts = isPostExits;
        return res.status(200).json({
          status: true,
          message: "This is post of user" + id,
          data: userPosts,
        });
      }
    } catch (error) {
      return res.status(404).json({
        message: error.message,
      });
    }
  },

  // get comments
  getComments: async (req, res) => {
    const { postId } = req.params;
    try {
      const hasComment = await commentModal
        .find({ postId })
        .populate({
          path: "userId",
          select: "firstName lastName location profession avatar -password",
        })
        .populate({
          path: "replies.userId",
          select: "firstName lastName location profession avatar -password",
        })
        .sort({ _id: 1 });

      if (!hasComment || hasComment.length === 0) {
        return res.status(400).json({
          status: false,
          message: "No comments found for post " + postId,
        });
      }

      if (hasComment) {
        return res.status(200).json({
          status: true,
          message: "This is comments of post " + postId,
          data: hasComment,
        });
      }
    } catch (error) {
      return res.status(404).json({
        message: error.message,
      });
    }
  },

  // like posts
  likePosts: async (req, res) => {
    const { userId } = req.body.user;
    const { id } = req.params;

    try {
      const postRecord = await postModal.findById(id);
      if (postRecord) {
        const index = postRecord.likes.findIndex(
          (postId) => postId === String(userId)
        );

        if (index === -1) {
          postRecord.likes.push(userId);
        } else {
          postRecord.likes = postRecord.likes.filter(
            (postId) => postId !== String(userId)
          );
        }
      }
      const postUpdate = await postModal.findByIdAndUpdate(id, postRecord);

      return res.status(200).json({
        status: true,
        message: "Post is liked",
        data: postUpdate,
      });
    } catch (error) {
      return res.status(404).json({
        message: error.message,
      });
    }
  },

  // comment post
  commentPost: async (req, res, next) => {
    const { comment, from } = req.body;
    const { userId } = req.body.user;
    const { id } = req.params;

    try {
      if (!comment) {
        res.status(400).json({
          status: false,
          message: "Please, enter some comment",
        });
      }

      const userInfo = await userModal.findById(userId);
      const postInfo = await postModal.findById(id);

      // query to create a new a comment
      const newComment = await commentModal.create({
        userId: userInfo,
        postId: id,
        comment,
        from,
      });
      postInfo.comments.push(newComment._id);
      await postInfo.save();

      return res.status(201).json({
        status: true,
        message: "Comment is created in post " + postInfo._id,
        comment: newComment,
      });
    } catch (error) {
      return res.status(404).json({
        message: error.message,
      });
    }
  },

  // like comment
  likeComment: async (req, res) => {
    const { userId } = req.body.user;
    const { id, replyId } = req.params;

    try {
      if (!replyId) {
        // query to find comment in based on comment id (id)
        const commentRecord = await commentModal.findById(id);

        //check is user exits on like list or not
        const index = commentRecord.likes.findIndex(
          (i) => i === String(userId)
        );

        if (index === -1) {
          commentRecord.likes.push(userId);
        } else {
          commentRecord.likes = commentRecord.likes.filter(
            (i) => i !== String(userId)
          );
        }
        const updateComment = await commentModal.findByIdAndUpdate(
          id,
          commentRecord
        );
        return res.status(201).json({
          status: true,
          message: "Comment is liked",
          data: updateComment,
        });
      } else {
        const query = { _id: id, "replies._id": replyId };
        const comment = await commentModal.findOne(query);

        if (!comment) {
          return res.status(404).json({
            status: false,
            message: "Reply not found",
          });
        }

        const reply = comment.replies.find(
          (reply) => String(reply._id) === String(replyId)
        );
        const index = reply.likes.findIndex((i) => i === String(userId));

        if (index === -1) {
          reply.likes.push(userId);
        } else {
          reply.likes = reply.likes.filter((i) => i !== String(userId));
        }

        await commentModal.updateOne(
          { _id: id, "replies._id": replyId },
          { $set: { "replies.$.likes": reply.likes } }
        );

        return res.status(200).json({
          status: true,
          message: "Reply liked",
          data: { replyId, likes: reply.likes },
        });
      }
    } catch (error) {
      return res.status(404).json({
        status: false,
        message: error.message,
      });
    }
  },

  // reply comment
  replyComment: async (req, res, next) => {
    const { userId } = req.body.user;
    const { comment, replyAt, from } = req.body;
    const { id } = req.params;

    try {
      if (!comment) {
        res.status(400).json({
          status: false,
          message: "Please, enter some comment",
        });
      }

      const userInfo = await userModal.findById(userId);
      const commentRecord = await commentModal.findById(id).populate({
        path: "replies.userId",
        select: "firstName lastName location profession avatar -password",
      });
      commentRecord.replies.push({
        comment,
        replyAt,
        from,
        userId: userInfo,
        createdAt: Date.now(),
      });
      await commentRecord.save();

      return res.status(200).json({
        status: true,
        message: "A reply has created in comment" + id,
        data: commentRecord,
      });
    } catch (error) {
      return res.status(404).json({
        status: false,
        message: error.message,
      });
    }
  },

  // delete post
  deletePost: async (req, res, next) => {
    const { id } = req.params;

    try {
      await postModal.findByIdAndDelete(id);
      return res.status(200).json({
        status: true,
        message: "Post is deleted",
      });
    } catch (error) {
      return res.status(404).json({
        status: false,
        message: error.message,
      });
    }
  },
};

module.exports = { postController };

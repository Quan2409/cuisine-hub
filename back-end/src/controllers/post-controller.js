const { response } = require("express");
const postModal = require("../models/post-model");
const userModal = require("../models/user-model");
const commentModal = require("../models/comments-model");

const postController = {
  // creat-post
  createPost: async (req, res, next) => {
    try {
      const { userId } = req.body.user;

      const { content, image } = req.body;
      if (!content) {
        next("Enter some content, please");
        return;
      }
      const post = await postModal.create({
        userId,
        content,
        image,
        createdAt: Date.now(),
      });
      console.log(userId);
      return res.status(201).json({
        status: true,
        message: "Post is created",
        data: post,
      });
    } catch (error) {
      console.log(error);
      return res.status(404).json({ message: error.message });
    }
  },

  searchPost: async (req, res) => {
    const { userId } = req.body.user;
    const { search } = req.body;

    try {
      const isUserExits = await userModal.findById(userId);
      const friends = isUserExits.friends.toString().split(",") ?? [];
      friends.push(userId);

      const searchQuery = {
        $or: [
          {
            content: { $regex: search, $options: "i" },
          },
        ],
      };

      const queryPost = await postModal
        .find(search ? searchQuery : {})
        .populate({
          path: "userId",
          select: "firstName lastName location avatar -password",
        })
        .sort({ _id: -1 });

      const friendPosts = queryPost.filter((post) => {
        return friends.includes(post.userId._id.toString());
      });

      const otherPosts = queryPost.filter((post) => {
        !friends.includes(post.userId._id.toString());
      });

      let postResponse = null;
      if (friendPosts.length > 0) {
        postResponse = search ? friendPosts : [...friendPosts, ...otherPosts];
      } else {
        postResponse = queryPost;
      }

      return res.status(200).json({
        status: true,
        message: "Search query result: ",
        data: postResponse,
      });
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        message: error.message,
      });
    }
  },

  getPostById: async (req, res) => {
    try {
      const { id } = req.params;
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
      console.log(error);
      return res.status(404).json({
        message: error.message,
      });
    }
  },

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
        return res.status(200).json({
          status: true,
          message: "This is post of user" + id,
          data: isPostExits,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        message: error.message,
      });
    }
  },

  getComments: async (req, res) => {
    try {
      const { postId } = req.params;

      const hasComment = await commentModal
        .find({ postId })
        .populate({
          path: "userId",
          select: "firstName lastName location avatar -password",
        })
        .populate({
          path: "replies.userId",
          select: "firstName lastName lcoation avatar -password",
        })
        .sort({ _id: 1 });

      if (hasComment) {
        return res.status(200).json({
          status: true,
          message: "This is comments of post" + postId,
          data: hasComment,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        message: error.message,
      });
    }
  },

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
      console.log(error);
      return res.status(404).json({
        message: error.message,
      });
    }
  },

  likeComment: async (req, res) => {
    const { userId } = req.body.user;
    const { id, replyId } = req.params;

    try {
      if (replyId === undefined || replyId === null || replyId === "fasle") {
        const commentRecord = await commentModal.findById(id);
        const index = commentRecord.likes.findIndex(
          (i) => i === String(userId)
        );
        if (index === -1) {
          commentRecord.likes.push(userId);
        } else {
          commentRecord.likes = comment.likes.filter(
            (i) => i !== String(userId)
          );
        }

        const updateComment = await commentModal.findByIdAndUpdate(
          id,
          commentRecord
        );
        if (updateComment) {
          return res.status(201).json({
            status: true,
            message: "Comment is liked",
            data: updateComment,
          });
        }
      } else {
        const findReplyCommement = await commentModal.findOne(
          { _id: id },
          {
            replies: {
              $elemMatch: {
                _id: replyId,
              },
            },
          }
        );

        const index = findReplyCommement.replies[0].likes.findIndex(
          (i) => i === String(userId)
        );
        if (index === -1) {
          findReplyCommement.replies[0].likes.push(userId);
        } else {
          findReplyCommement.replies[0].likes =
            findReplyCommement.replies[0].likes.filter(
              (i) => i !== String(userId)
            );
        }

        const query = { _id: id, "replies._id": replyId };
        const updateRepplyComment = {
          $set: {
            "replies.$.likes": findReplyCommement.replies[0].likes,
          },
        };
        await commentModal.updateOne(query, updateRepplyComment);
        return res.status(201).json({
          status: true,
          message: "An reply is liked in comment" + id,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        message: error.message,
      });
    }
  },

  commentPost: async (req, res, next) => {
    const { comment, from } = req.body;
    const { userId } = req.body.user;
    const { id } = req.params;

    try {
      if (!comment) {
        next("Enter some comment, please");
        return;
      }

      const newComment = await commentModal.create({
        comment,
        from,
        userId,
        postId: id,
      });
      await newComment.save();

      //update comment in postModal
      const postRecord = await postModal.findById(id);
      postRecord.comments.push(newComment._id);
      const updatePost = await postModal.findByIdAndUpdate(id, postRecord);
      if (updatePost) {
        return res.status(201).json({
          status: true,
          message: "Comment is created in post" + postRecord._id,
          comment: newComment,
          newpost: updatePost,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        message: error.message,
      });
    }
  },

  replyComemnt: async (req, res, next) => {
    const { userId } = req.body.user;
    const { comment, replyAt, from } = req.body;
    const { id } = req.params;

    try {
      if (!comment) {
        next("Comment is required");
        return;
      }

      const commentRecord = await commentModal.findById(id);
      commentRecord.replies.push({
        comment,
        replyAt,
        from,
        userId,
        createdAt: Date.now(),
      });
      const updateComment = await commentRecord.save();
      if (updateComment) {
        return res.status(200).json({
          status: true,
          message: "A reply has created in comment" + id,
          data: updateComment,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        message: error.message,
      });
    }
  },

  deletePost: async (req, res, next) => {
    const { id } = req.params;

    try {
      await postModal.findByIdAndDelete(id);
      return res.status(200).json({
        status: true,
        message: "Post is deleted",
      });
    } catch (error) {
      console.log(error);
      return res.status(404).json({ message: error.message });
    }
  },
};

module.exports = { postController };

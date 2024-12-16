const express = require("express");
const router = express.Router();

const { postController } = require("../controllers/post-controller");
const authMiddleware = require("../middlewares/auth-middleware");

//create post
router.post("/create-post", authMiddleware, postController.createPost);

// get post by id
router.get("/:id", authMiddleware, postController.getPostById);

// get user post
router.get("/get-user-post/:id", authMiddleware, postController.getUserPosts);

// get-comment
router.get("/get-comment/:postId", postController.getCommentsTree);

// like post
router.post("/like/:id", authMiddleware, postController.likePosts);

// comment post
router.post("/comment/:id", authMiddleware, postController.commentPost);

// reply comment
router.post("/reply-comment/:id", authMiddleware, postController.replyComment);

// like comment and reply
router.post(
  "/like-comment/:id/:replyId?",
  authMiddleware,
  postController.likeComment
);

// get all post
router.get("/", authMiddleware, postController.getAllPosts);

// get all post
router.post("/search", authMiddleware, postController.searchPost);

//delete post
router.delete("/:id", authMiddleware, postController.deletePost);

module.exports = router;

var express = require("express")
const router = express.Router()

var auth = require("../middleware/auth.js")
var { createPost, updatePost, deletePost, toggleLikePost, addComment, deleteComment, getLikesAndComments, getAllPosts, getPostsOfUser, getPostById } =  require("../controllers/Posts.js")

//user uploads a post
router.post("/uploadPost", auth, createPost)
router.post("/updatePost/:id", auth, updatePost)
router.delete("/deletePost/:id", auth, deletePost)

router.get("/getAllPosts", auth, getAllPosts)
router.get("/getPostsOfUser/:userId", auth, getPostsOfUser)
router.get("/getPostsById/:postId", auth, getPostById)

router.post("/toggleLikePost/:postId", auth, toggleLikePost)

router.post("/addComment/:postId", auth, addComment)
router.delete("/deleteComment/:cmtId", auth, deleteComment)

router.get("/likes-comments-count/:postId", auth, getLikesAndComments)


module.exports = router
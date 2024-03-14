const { default: mongoose } = require("mongoose")
const Post = require("../models/Post")
const { User } = require("../models/User")

//CREATE POST
const createPost = async (req, res) => {
    try {
        
        const {creatorId, caption} = req.body

        const user = await User.findById(creatorId)

        const newPost = new Post({
            creatorId,
            username: user.username,
            caption,
            likedBy: [],
            comments: []
        })

        await newPost.save()
        res.status(200).json(newPost)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

//UPDATING POST
const updatePost = async (req, res) => {
    try {
        const { id: _id } = req.params
        const { caption } = req.body

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).send("Cannot find any post with this id")
        }

        const update = { caption }

        const updatedPost = await Post.findByIdAndUpdate(_id, update, { new: true })

        res.status(200).json(updatedPost)

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

//DELETING POST
const deletePost = async (req, res) => {
    try {
        const { id: _id } = req.params
        const { userId } = req.body
        const targetPost = await Post.findById(_id)

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).send("Cannot find any post with this id")
        }

        if(targetPost.id !== userId) {
            return res.status(404).send({ message: "Cannot delete this post!" })
        }

        const result = await Post.findByIdAndDelete(_id);
        if (!result) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).send({ message: 'Post deleted successfully' });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

//GET POST BY POSTID
const getPostById = async (req, res) => {
    const { postId } = req.params
    try {
        
        const post = await Post.findById(postId)

        if(!post) {
            return res.status(404).json({ message: "Post not found." })
        }

        res.status(200).json(post)

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

//GET ALL POSTS BY USERID

const getPostsOfUser = async (req, res) => {

    const { userId } = req.params

    try {
        
        const posts = await Post.find({ creatorId: userId })

        if(!posts) {
            return res.status(404).json({ message: "Post/s not found." })
        }

        res.status(200).json(posts)

    } catch (error) {
        res.status(500).send({ message: error.message });
    }

}

//GET POSTS BY ALL

const getAllPosts = async (req, res) => {
    
    try {
        const posts = await Post.find({})

        if(!posts) {
            return res.status(404).json({ message: "Post/s not found." })
        }

        res.status(200).json(posts)
        
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

}

//LIKING/UNLIKING A POST
const toggleLikePost = async (req, res) => {

    const { userId } = req.body
    const { postId } = req.params

    console.log(postId)

    try {

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const index = post.likedBy.indexOf(userId)
        // console.log(index)
        if (index === -1) {
            post.likedBy.push(userId)
        } else {
            post.likedBy.splice(index, 1)
        }
        
        await post.save();

        res.json(post);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//ADDING A COMMENT
const addComment = async (req, res) => {
    const { userId, text } = req.body
    const { postId } = req.params

    try {
        
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.push({ commentBy: userId, text })
        await post.save()
        res.json(post)

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//DELETING A COMMENT
const deleteComment = async (req, res) => {
    const { cmtId } = req.params
    const { userId, postId } = req.body

    // console.log(cmtId)
    try {

        const post = await Post.findById(postId);

        const comment = post.comments

        console.log(comment)
      
        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' });
        }

        if (!post) {
            return res.status(404).json({ message: "Post doesn't exist!" });
        }

        const targetCmt = post.comments.find((cmt) => cmt.id === cmtId)

        // if (targetIdx === -1) {
        //     return res.status(404).json({ message: "Comment doesn't exist!" });
        // }

        const commentOwner = targetCmt.commentBy;
        if (commentOwner.toString() !== userId) {
            return res.status(403).json({ message: "You cannot delete this comment!" });
        }

        const removeIndex = post.comments
        .map(comment => comment.id)
        .indexOf(cmtId);   

        post.comments.splice(removeIndex, 1);

        await post.save();

        return res.status(200).send({ message: 'Comment deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getLikesAndComments = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const likesCount = post.likedBy.length;
        const commentsCount = post.comments.length;

        return res.status(200).json({ likesCount, commentsCount });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { createPost, updatePost, deletePost, toggleLikePost, addComment, deleteComment, getLikesAndComments, getPostById, getPostsOfUser, getAllPosts }
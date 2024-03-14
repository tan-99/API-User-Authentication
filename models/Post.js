const mongoose = require("mongoose")
const Schema = mongoose.Schema

// const User = require('./User')

const postSchema = new Schema({
    caption: {
        type: String
    },
    creatorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    // images: {
    //     type: String
    // },
    likedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            commentBy: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            text: {
                type: String,
            }
        }
    ],
    createdAt: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model("Post", postSchema)
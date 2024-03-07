const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Joi = require("joi")

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        min: 5,
        max: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 5,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 100
    },
})

const User = mongoose.model("user", userSchema);

const validate = (user) => {
    const schema = Joi.object({
        username: Joi.string().min(5).max(100).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(100).required()
    })
    return schema.validate(user)
}

module.exports = { User, validate }
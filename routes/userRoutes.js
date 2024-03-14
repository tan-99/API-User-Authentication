const { User, validate } = require('../models/User')
const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET
const jwtExpirySeconds = 300

const Joi = require("joi")
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

router.post('/register', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    let user = await User.findOne({ email: req.body.email })
    if (user) {
        return res.status(400).send("Registration failed: Username already exists")
    } else {
        try {
            const salt = await bcrypt.genSalt(10)
            const password = await bcrypt.hash(req.body.password, salt)
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: password
            })
            await user.save()
            return res.status(201).json(user)
        } catch (err) {
            return res.status(400).json({ message: err.message })
        }
    }
})

router.post('/login', async (req, res) => {
    const schema = Joi.object({ 
        username: Joi.string().required(),
        password: Joi.string().required(),
    });
    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(401).send(error.details[0].message)
    } else {
        try {
            let user = await User.findOne({ username: req.body.username })
            if (!user) {
                return res.status(400).json({ message: "Incorrect credentials" })
            }
            const correctPassword = await bcrypt.compare(req.body.password, user.password)
            if (!correctPassword) {
                return res.status(400).json({ message: "Incorrect credentials" })
            }
            const token = jwt.sign({ id: user._id }, SECRET)
            // res.cookie(
            //     "token", token, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === 'development',
            //     sameSite: "strict",
            //     maxAge: jwtExpirySeconds * 1000
            // })
            res.json({ message: 'Successfully logged in' })

        } catch (err) {
            return res.status(400).json({ message: err.message })
        }
    }
})

router.post('/passwordReset-Req', async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist." });
        }
        const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });

        const resetLink = `${req.protocol}://${req.get('host')}/password-reset/${token}`;
        
        await sendEmail(user.email, "Password Reset", resetLink);
        
        res.json({ message: "Password reset link sent to your email account" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
})

router.post('/password-reset/:token', async (req, res) => {
    try {

        const decoded = jwt.verify(req.params.token, SECRET);
        
        if (!decoded.userId) {
            return res.status(400).json({ message: "Invalid token..." });
        }
        
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }
        // Reset the user's password
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(req.body.password, salt);
        user.password = newPassword;
        await user.save();
        res.json({ message: "Password reset successfully" });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({ message: "Invalid token" });
        }
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
});

module.exports = router
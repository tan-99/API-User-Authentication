const jwt = require("jsonwebtoken")

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token) {
            return res.status(403).send("Access Denied!")
        }

        const decoded = jwt.verify(token, process.env.SECRET)
        req.user = decoded
        next()
    } catch (error) {
        console.log(error)
        res.status(400).send("Invalid token");
    }
}

module.exports = auth
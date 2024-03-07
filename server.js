require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors");

const mongoDB = require("./db")
mongoDB()

const userRouter = require("./routes/userRoutes")

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000

app.use('/api', userRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
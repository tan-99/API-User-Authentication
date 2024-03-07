const mongoose = require("mongoose");
// const mongoUri =
//   process.env.MONGODB_URI;

const MongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)

    console.log(`MongoDB connected successfully...`)
  } catch (error) {
    console.log(`Error: ${error.message}`)
    process.exit()
  }
};

module.exports = MongoDB;
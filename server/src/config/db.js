const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB");
    }). catch((err) => {
        console.log("Error connecting to MongoDB: ", err);
        process.exit(1);
    })
};

module.exports = connectDB;
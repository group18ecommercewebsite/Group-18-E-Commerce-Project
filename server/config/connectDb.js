import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


if (!process.env.MONGODB_URI) {
    throw new Error(
        "Please provide MONGODB_URI in the .env file"
    )
}

// Kết nối tới MongoDB Atlas
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connect DB")
    }
    catch (error) {
        console.log("MongoDB connect error", error)
        process.exit(1)
    }
}

export default connectDB
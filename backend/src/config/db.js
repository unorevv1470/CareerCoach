

import "dotenv/config";
import dns from "node:dns";
import mongoose from "mongoose";

// Fix MongoDB Atlas DNS resolution
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
  try {
    // Read and clean the MongoDB connection string
    const mongoUri = process.env.MONGO_URI?.trim();

    // Safe diagnostic: never print the actual URI or password
    console.log("MongoDB URI diagnostic:", {
      exists: Boolean(mongoUri),
      correctPrefix:
        mongoUri?.startsWith("mongodb+srv://") ||
        mongoUri?.startsWith("mongodb://")
    });

    if (!mongoUri) {
      throw new Error("MONGO_URI is missing in environment variables.");
    }

    if (
      !mongoUri.startsWith("mongodb+srv://") &&
      !mongoUri.startsWith("mongodb://")
    ) {
      throw new Error("MONGO_URI has an invalid connection string format.");
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;

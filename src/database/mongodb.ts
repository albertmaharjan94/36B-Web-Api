// src/database/mongodb.ts
import mongoose from "mongoose";
import { MONGODB_URI } from "../config/constant";

export const connectToMongoDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};

export const connectToMongoDBTest = async () => {
    const testUri = "mongodb://localhost:27017/class36b_test";
    try {
        await mongoose.connect(testUri);
        console.log("Connected to MongoDB Test");
    } catch (error) {
        console.error("Error connecting to MongoDB Test:", error);
        throw error;
    }
};
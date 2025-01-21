// src/lib/server/db.ts
import mongoose from 'mongoose';
import { MONGODB_URI } from '$env/static/private';

const uri = MONGODB_URI;

export async function connectDB(): Promise<typeof mongoose> {
    if (mongoose.connection.readyState >= 1) {
        return mongoose;
    }

    try {
        await mongoose.connect(uri);
        console.log("Successfully connected to MongoDB");
        return mongoose;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

export async function closeDB(): Promise<void> {
    if (mongoose.connection.readyState === 0) {
        return;
    }
    
    try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed");
    } catch (error) {
        console.error("Error closing MongoDB connection:", error);
        throw error;
    }
}
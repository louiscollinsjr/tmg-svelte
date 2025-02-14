// src/lib/server/db.ts
import mongoose from 'mongoose';
import { MONGODB_URI } from '$env/static/private';

const uri = MONGODB_URI;

let isConnected = false;

export async function connectDB(): Promise<typeof mongoose> {
    if (isConnected) {
        return mongoose;
    }

    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(uri);
            isConnected = true;
            console.log("Successfully connected to MongoDB");
        }
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
        isConnected = false;
        console.log("MongoDB connection closed");
    } catch (error) {
        console.error("Error closing MongoDB connection:", error);
        throw error;
    }
}

// Ensure models are registered after connection
export async function ensureDbConnected() {
    await connectDB();
    
    // Import models here to ensure they're registered after connection
    await Promise.all([
        import('./models/user'),
        import('./models/conversation'),
        import('./models/image')
    ]);
}
// src/lib/server/db.ts
import { MongoClient, Db } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';

const uri = MONGODB_URI;
let client: MongoClient | undefined;
let db: Db | undefined;

export async function connectToDatabase(): Promise<Db> {

  if (db) return db;

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('test'); // Your database name
    console.log("Successfully connected to MongoDB");

    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}

export async function closeDatabase(): Promise<void> {
    if (client) {
        await client.close();
        console.log("Successfully closed MongoDB connection.")
    }
}
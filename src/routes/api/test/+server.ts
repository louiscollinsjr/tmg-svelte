    // src/routes/api/test/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import { connectDB, closeDB } from '$lib/server/db';

export const GET: RequestHandler = async () => {
    try {
        await connectDB();
        await closeDB();
        return json({ success: true, message: "Successfully connected to MongoDB" });
    } catch (err) {
        return json({ success: false, error: String(err) });
    }
};
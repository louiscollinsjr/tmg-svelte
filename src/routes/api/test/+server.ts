    // src/routes/api/test/+server.ts
    import { json, type RequestHandler } from '@sveltejs/kit';
    import { connectToDatabase, closeDatabase } from '$lib/server/db';


    export const GET: RequestHandler = async () => {
        try {
            const db =  await connectToDatabase();
                await closeDatabase();
                return json({success: true, message: "Successfully connected to MongoDB" });
        } catch (err) {
            return json({success: false, error: String(err)});
        }
    };
// src/routes/api/auth/signup/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { getUserModel } from '$lib/server/models/user';

export const POST: RequestHandler = async ({ request }) => {
    await connectDB();
    const User = getUserModel();

    try {
        const { email, password } = await request.json(); // Add other fields as needed

        // Basic validation (add more as needed)
        if (!email || !password) {
            return json({ success: false, error: 'Email and password are required' }, { status: 400 });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return json({ success: false, error: 'User already exists' }, { status: 409 }); // 409 Conflict
        }

        // Create a new user (hash the password securely in production)
        const newUser = new User({
            email,
            password, // Hash the password before saving!
            // Add other fields as necessary
        });

        await newUser.save();

        return json({ success: true, message: 'User created successfully' }, { status: 201 }); // 201 Created
    } catch (error) {
        console.error('Signup error:', error);
        return json({ success: false, error: 'Failed to create user' }, { status: 500 });
    }
};
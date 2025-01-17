import { json } from '@sveltejs/kit';
import { User } from '$lib/models/user';
import type { RequestHandler } from './$types';
import { connectDB } from '$lib/server/db';

export const GET: RequestHandler = async ({ locals }) => {
    await connectDB();
    const session = await locals.auth();
    
    if (!session?.user?.email) {
        return new Response('Unauthorized', { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
        return new Response('User not found', { status: 404 });
    }

    return json(user);
};

export const PUT: RequestHandler = async ({ locals, request }) => {
    await connectDB();
    const session = await locals.auth();
    
    if (!session?.user?.email) {
        return new Response('Unauthorized', { status: 401 });
    }

    const updates = await request.json();
    const user = await User.findOneAndUpdate(
        { email: session.user.email },
        { $set: updates },
        { new: true }
    );

    if (!user) {
        return new Response('User not found', { status: 404 });
    }

    return json(user);
};

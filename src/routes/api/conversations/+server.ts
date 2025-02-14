import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getConversationModel } from '$lib/server/models/conversation';
import { getUserModel } from '$lib/server/models/user';
import { getImageModel } from '$lib/server/models/image';
import { ensureDbConnected } from '$lib/server/db';

export const GET: RequestHandler = async ({ locals }) => {
    try {
        // Ensure DB connection and model registration
        await ensureDbConnected();
        
        const session = await locals.auth();
        if (!session?.user?.email) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user data from email
        const User = getUserModel();
        const userData = await User.findOne({ email: session.user.email }).lean();
        
        if (!userData?._id) {
            return json({ error: 'User not found' }, { status: 404 });
        }

        // Find all conversations where the user is either the sender or receiver
        const Conversation = getConversationModel();
        const conversations = await Conversation.find({
            $or: [
                { fromId: userData._id },
                { toId: userData._id }
            ]
        })
        .sort({ 'messages.timestamp': -1 })
        .populate('toId', 'name image')
        .populate('fromId', 'name image')
        .populate({
            path: 'messages.imageIds',
            model: getImageModel()
        })
        .lean();

        return json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};

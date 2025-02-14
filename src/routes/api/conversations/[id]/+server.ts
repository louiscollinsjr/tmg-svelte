import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getConversationModel } from '$lib/server/models/conversation';
import { getImageModel } from '$lib/server/models/image';
import { getUserModel } from '$lib/server/models/user';
import { ensureDbConnected } from '$lib/server/db';
import mongoose from 'mongoose';

export const GET: RequestHandler = async ({ params, locals }) => {
    try {
        // Ensure DB connection and model registration
        await ensureDbConnected();
        
        const session = await locals.auth();
        if (!session?.user?.email) {
            console.error('No session or email found');
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const User = getUserModel();
        const userData = await User.findOne({ email: session.user.email }).lean();
        
        if (!userData?._id) {
            console.error('User not found for email:', session.user.email);
            return json({ error: 'User not found' }, { status: 404 });
        }

        // Validate conversation ID
        if (!params.id || !mongoose.Types.ObjectId.isValid(params.id)) {
            console.error('Invalid conversation ID format:', params.id);
            return json({ error: 'Invalid conversation ID format' }, { status: 400 });
        }

        const conversationId = new mongoose.Types.ObjectId(params.id);
        const userObjectId = new mongoose.Types.ObjectId(userData._id);

        const Conversation = getConversationModel();
        console.log('Fetching conversation:', conversationId, 'for user:', userObjectId);
        
        const conversation = await Conversation.findOne({
            _id: conversationId,
            $or: [
                { fromId: userObjectId },
                { toId: userObjectId }
            ]
        })
        .populate('toId', 'name image')
        .populate('fromId', 'name image')
        .populate({
            path: 'messages.imageIds',
            model: getImageModel()
        })
        .lean();

        if (!conversation) {
            console.error('Conversation not found:', {
                conversationId: conversationId.toString(),
                userId: userObjectId.toString()
            });
            return json({ error: 'Conversation not found' }, { status: 404 });
        }

        // Log the success but without sensitive data
        console.log('Successfully fetched conversation:', {
            id: conversationId.toString(),
            messageCount: conversation.messages?.length || 0
        });

        return json(conversation);
    } catch (error) {
        console.error('Error fetching conversation:', {
            error: error instanceof Error ? {
                name: error.name,
                message: error.message,
                stack: error.stack
            } : error,
            params: params.id
        });

        if (error instanceof mongoose.Error.CastError) {
            return json({ 
                error: 'Invalid ID format',
                details: 'The provided conversation ID is not in the correct format'
            }, { status: 400 });
        }

        return json({ 
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : 'Unknown error occurred while fetching conversation'
        }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ request, params, locals }) => {
    try {
        // Ensure DB connection and model registration
        await ensureDbConnected();
        
        const session = await locals.auth();
        if (!session?.user?.email) {
            console.error('No session or email found');
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const User = getUserModel();
        const userData = await User.findOne({ email: session.user.email }).lean();
        
        if (!userData?._id) {
            console.error('User not found for email:', session.user.email);
            return json({ error: 'User not found' }, { status: 404 });
        }

        // Validate conversation ID
        if (!params.id || !mongoose.Types.ObjectId.isValid(params.id)) {
            console.error('Invalid conversation ID format:', params.id);
            return json({ error: 'Invalid conversation ID format' }, { status: 400 });
        }

        const conversationId = new mongoose.Types.ObjectId(params.id);
        const userObjectId = new mongoose.Types.ObjectId(userData._id);

        const { content, type = 'message', imageIds = [] } = await request.json();
        
        // Validate imageIds if type is 'image'
        if (type === 'image' && imageIds.length > 0) {
            const Image = getImageModel();
            const validImages = await Image.find({
                _id: { $in: imageIds.map(id => {
                    if (!mongoose.Types.ObjectId.isValid(id)) {
                        throw new Error(`Invalid image ID format: ${id}`);
                    }
                    return new mongoose.Types.ObjectId(id);
                })},
                uploadedBy: userObjectId
            }).lean();

            if (validImages.length !== imageIds.length) {
                console.error('Invalid image IDs provided:', {
                    provided: imageIds,
                    found: validImages.map(img => img._id)
                });
                return json({ error: 'Invalid image IDs provided' }, { status: 400 });
            }
        }

        const Conversation = getConversationModel();
        console.log('Updating conversation:', conversationId, 'for user:', userObjectId);
        
        const conversation = await Conversation.findOneAndUpdate(
            {
                _id: conversationId,
                $or: [
                    { fromId: userObjectId },
                    { toId: userObjectId }
                ]
            },
            {
                $push: {
                    messages: {
                        sender: userObjectId.toString(),
                        content,
                        type,
                        imageIds: type === 'image' ? imageIds.map(id => new mongoose.Types.ObjectId(id)) : [],
                        timestamp: new Date(),
                        read: false
                    }
                }
            },
            { new: true }
        )
        .populate('toId', 'name image')
        .populate('fromId', 'name image')
        .populate({
            path: 'messages.imageIds',
            model: getImageModel()
        });

        if (!conversation) {
            console.error('Conversation not found for update:', {
                conversationId: conversationId.toString(),
                userId: userObjectId.toString()
            });
            return json({ error: 'Conversation not found' }, { status: 404 });
        }

        // Log the success but without sensitive data
        console.log('Successfully updated conversation:', {
            id: conversationId.toString(),
            messageCount: conversation.messages?.length || 0
        });

        return json(conversation);
    } catch (error) {
        console.error('Error updating conversation:', {
            error: error instanceof Error ? {
                name: error.name,
                message: error.message,
                stack: error.stack
            } : error,
            params: params.id
        });

        if (error instanceof mongoose.Error.CastError) {
            return json({ 
                error: 'Invalid ID format',
                details: 'The provided conversation or image ID is not in the correct format'
            }, { status: 400 });
        }

        return json({ 
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : 'Unknown error occurred while updating conversation'
        }, { status: 500 });
    }
};

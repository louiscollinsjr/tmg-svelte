import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getConversationModel } from '$lib/server/models/conversation';
import { getProjectModel } from '$lib/server/models/project';
import mongoose from 'mongoose';


export const POST: RequestHandler = async ({ request, locals }) => {
    const session = await locals.getSession();
    if (!session?.user) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { tradespersonId, userId, projectId } = await request.json();
    if (!tradespersonId || !userId) {
        return json({ error: 'Tradesperson ID and User ID are required' }, { status: 400 });
    }

    const Project = getProjectModel();
    const Conversation = getConversationModel();

    try {
        console.log('Starting conversation creation. Session user ID:', session.user.id, 'Tradesperson ID:', tradespersonId);
        // Convert string IDs to ObjectIds
        const fromId = new mongoose.Types.ObjectId(userId); // Use userId from request body
        const toId = new mongoose.Types.ObjectId(tradespersonId);

        console.log('User ID:', fromId.toString());
        console.log('Tradesperson ID:', toId.toString());
        console.log('Project ID:', projectId);

        // Find user's active projects without a contractor if projectId is not provided
        const activeProject = projectId ? await Project.findById(projectId) : await Project.findOne({
            owner: fromId,
            contractor: null,
            status: { $nin: ['completed', 'cancelled'] }
        }).sort({ createdAt: -1 });

        if (activeProject) {
            console.log('Active Project ID:', activeProject._id.toString());
        } else {
            console.log('No active project found for user');
        }

        // Check for existing conversation
        const existingConversation = await Conversation.findOne({
            $or: [
                { fromId, toId },
                { fromId: toId, toId: fromId }
            ]
        });

        const messageContent = `I would like an estimate for my project${activeProject ? ` - ${activeProject._id} (${activeProject.category})` : ''}.`;

        if (existingConversation) {
            console.log('Existing conversation found, adding new message');
            existingConversation.messages.push({
                sender: fromId.toString(),
                content: messageContent,
                timestamp: new Date(),
                read: false,
                projectId: activeProject ? activeProject._id : undefined, // Include projectId in message
                metadata: activeProject ? {
                    projectId: activeProject._id.toString(),
                    category: activeProject.category
                } : undefined
            });
            await existingConversation.save();
            console.log('Message added to existing conversation:', existingConversation._id.toString());

            return json({
                conversationId: existingConversation._id,
                message: 'Message added to existing conversation'
            });
        }

        console.log('No existing conversation found, creating new conversation');
        const newConversation = await Conversation.create({
            fromId,
            toId,
            projectId: activeProject?._id,
            metadata: activeProject ? {
                projectTitle: activeProject.title,
                category: activeProject.category
            } : undefined,
            messages: [{
                sender: fromId.toString(),
                content: messageContent,
                timestamp: new Date(),
                read: false,
                projectId: activeProject ? activeProject._id : undefined, // Include projectId in message
                metadata: activeProject ? {
                    projectId: activeProject._id.toString(),
                    type: 'estimate_request',
                    category: activeProject.category
                } : undefined
            }]
        });
        console.log('New conversation created with ID:', newConversation._id.toString());

        return json({
            conversationId: newConversation._id,
            message: 'New conversation created'
        });

    } catch (error) {
        console.error('Error creating estimate conversation:', error);
        return json({ error: 'Failed to create conversation' }, { status: 500 });
    }
};

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUserSavedItemModel } from '$lib/server/models/userSavedItem';
import mongoose from 'mongoose';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { userId, itemId, itemType } = await request.json();

        // Validate required fields
        if (!userId || !itemId || !itemType) {
            return json({ error: 'Missing required fields' }, { status: 400 });
        }

        const UserSavedItem = getUserSavedItemModel();

        // Check if item is already saved
        const existingSavedItem = await UserSavedItem.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            itemId: new mongoose.Types.ObjectId(itemId),
            itemType
        });

        if (existingSavedItem) {
            // If item exists, remove it (unsave)
            await UserSavedItem.deleteOne({
                userId: new mongoose.Types.ObjectId(userId),
                itemId: new mongoose.Types.ObjectId(itemId),
                itemType
            });

            return json({ message: 'Item unsaved successfully', saved: false });
        } else {
            // If item doesn't exist, save it
            const newSavedItem = new UserSavedItem({
                userId: new mongoose.Types.ObjectId(userId),
                itemId: new mongoose.Types.ObjectId(itemId),
                itemType,
                createdAt: new Date()
            });

            await newSavedItem.save();

            return json({ 
                message: 'Item saved successfully',
                saved: true,
                savedItemId: newSavedItem._id 
            });
        }
    } catch (error) {
        console.error('Error handling saved item:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};

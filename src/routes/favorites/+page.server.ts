import { error } from '@sveltejs/kit';
import { getUserSavedItemModel } from '$lib/server/models/userSavedItem';
import { getUserModel } from '$lib/server/models/user';
import mongoose from 'mongoose';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    try {
        const session = await locals.auth();
        console.log('Auth session:', session);
        
        if (!session?.user) {
            throw error(401, 'Unauthorized');
        }

        // Initialize User model
        const User = getUserModel();

        // First get the MongoDB user document to get the correct _id
        const userDoc = await User.findOne({
            email: session.user.email
        }).lean();

        if (!userDoc) {
            console.error('User document not found for email:', session.user.email);
            throw error(404, 'User not found');
        }

        console.log('Found user document:', userDoc._id);

        const UserSavedItem = getUserSavedItemModel();

        // Only fetch User types
        const savedItems = await UserSavedItem.find({ 
            userId: userDoc._id,
            itemType: 'User'
        })
        .populate({
            path: 'itemId',
            model: 'User' // Directly use the User model
        })
        .lean();

        console.log('Found saved items:', savedItems.length);

        const groupedItems = savedItems.reduce((acc, item) => {
            if (!item.itemId) {
                console.log('Skipping item due to missing itemId:', item._id, 'type:', item.itemType);
                return acc;
            }

            if (!acc[item.itemType]) {
                acc[item.itemType] = [];
            }

            const itemData = {
                ...item.itemId,
                _id: item.itemId._id.toString(), // Convert ObjectId to string
                savedItemId: item._id.toString(), // Convert ObjectId to string
                savedAt: item.createdAt,
                providers: item.itemId.providers.map(provider => ({
                    ...provider,
                    _id: provider._id.toString() // Convert ObjectId to string
                })),
                selectedServices: item.itemId.selectedServices.map(service => ({
                    ...service,
                    _id: service._id.toString() // Convert ObjectId to string
                }))
            };
        

            console.log('Adding item of type:', item.itemType, 'with ID:', item.itemId._id);
            acc[item.itemType].push(itemData);
            return acc;
        }, {});

        console.log('Grouped items by type:', Object.keys(groupedItems));
        return { items: groupedItems };
    } catch (err) {
        console.error('Error in favorites load function:', err);
        throw error(500, { message: err instanceof Error ? err.message : 'Unknown error occurred' });
    }
};

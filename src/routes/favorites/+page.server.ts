import { error } from '@sveltejs/kit';
import { getUserSavedItemModel } from '$lib/server/models/userSavedItem';
import { getUserModel } from '$lib/server/models/user';
import { getProjectModel } from '$lib/server/models/project';
import { getReviewModel } from '$lib/server/models/review';
import mongoose from 'mongoose';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    try {
        const session = await locals.auth();
        console.log('Auth session:', session);
        
        if (!session?.user) {
            throw error(401, 'Unauthorized');
        }

        // Initialize models
        const User = getUserModel();
        const Project = getProjectModel();
        const Review = getReviewModel();

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

        // First get User saved items
        const userSavedItems = await UserSavedItem.find({ 
            userId: userDoc._id,
            itemType: 'User'
        })
        .populate({
            path: 'itemId',
            model: User
        })
        .lean();

        // Then get Project saved items
        const projectSavedItems = await UserSavedItem.find({ 
            userId: userDoc._id,
            itemType: 'Project'
        })
        .populate({
            path: 'itemId',
            model: Project
        })
        .lean();

        // Get all reviews for the saved users
        const userIds = userSavedItems.map(item => item.itemId._id);
        const reviews = await Review.find({
            contractor: { $in: userIds }
        }).lean();

        // Calculate average ratings
        const ratings = reviews.reduce((acc, review) => {
            const contractorId = review.contractor.toString();
            if (!acc[contractorId]) {
                acc[contractorId] = { total: 0, count: 0 };
            }
            acc[contractorId].total += review.rating || 0;
            acc[contractorId].count += 1;
            return acc;
        }, {});

        // Combine both sets of items
        const savedItems = [...userSavedItems, ...projectSavedItems];
        console.log('Found saved items:', savedItems.length);

        const groupedItems = savedItems.reduce((acc, item) => {
            if (!item.itemId) {
                console.log('Skipping item due to missing itemId:', item._id, 'type:', item.itemType);
                return acc;
            }

            if (!acc[item.itemType]) {
                acc[item.itemType] = [];
            }

            // Convert ObjectIds to strings based on item type
            let itemData;
            if (item.itemType === 'User') {
                const userId = item.itemId._id.toString();
                const rating = ratings[userId] 
                    ? (ratings[userId].total / ratings[userId].count).toFixed(1)
                    : '0.0';

                itemData = {
                    ...item.itemId,
                    _id: userId,
                    savedItemId: item._id.toString(),
                    savedAt: item.createdAt,
                    rating: parseFloat(rating),
                    reviewCount: ratings[userId]?.count || 0,
                    providers: item.itemId.providers.map(provider => ({
                        ...provider,
                        _id: provider._id.toString()
                    })),
                    selectedServices: item.itemId.selectedServices?.map(service => ({
                        ...service,
                        _id: service._id.toString()
                    })) || []
                };
            } else if (item.itemType === 'Project') {
                const contractor = item.itemId.contractor ? {
                    _id: item.itemId.contractor._id.toString(),
                    name: item.itemId.contractor.name,
                    email: item.itemId.contractor.email,
                    image: item.itemId.contractor.image
                } : null;

                itemData = {
                    title: item.itemId.title,
                    description: item.itemId.description,
                    status: item.itemId.status,
                    budget: item.itemId.budget,
                    timeline: item.itemId.timeline,
                    location: item.itemId.location,
                    category: item.itemId.category,
                    _id: item.itemId._id.toString(),
                    savedItemId: item._id.toString(),
                    savedAt: item.createdAt,
                    owner: item.itemId.owner ? {
                        _id: item.itemId.owner._id.toString(),
                        name: item.itemId.owner.name,
                        email: item.itemId.owner.email,
                        image: item.itemId.owner.image
                    } : null,
                    contractor,
                    collaborators: (item.itemId.collaborators || []).map(collab => ({
                        _id: collab._id.toString(),
                        name: collab.name,
                        email: collab.email,
                        image: collab.image
                    }))
                };
            }

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

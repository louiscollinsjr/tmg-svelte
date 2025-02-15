import type { PageServerLoad } from './$types';
import { getProjectModel } from '$lib/server/models/project';
import { getReviewModel } from '$lib/server/models/review';
import { getUserModel } from '$lib/server/models/user';
import { error } from '@sveltejs/kit';
import mongoose from 'mongoose';

// Helper to convert MongoDB document to plain object with string IDs
function serializeDoc(doc: any) {
    if (!doc) return null;

    // Convert to plain object if it's a Mongoose document
    const plainDoc = JSON.parse(JSON.stringify(doc));

    // Create a new object without symbolic keys
    const serialized: any = {};
    
    // Copy all enumerable properties
    Object.keys(plainDoc).forEach(key => {
        serialized[key] = plainDoc[key];
    });

    // Ensure _id is a string
    if (serialized._id) {
        serialized._id = serialized._id.toString();
    }

    return serialized;
}

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.getSession();
    if (!session?.user?.email) {
        throw error(401, 'Unauthorized');
    }

    try {
        const Project = getProjectModel();
        const Review = getReviewModel();
        const User = getUserModel();

        // Find the user first
        const userData = await User.findOne({ email: session.user.email }).lean();
        if (!userData) {
            throw error(404, 'User not found');
        }

        const userIdStr = userData._id.toString();
        console.log('Looking for projects for user:', { 
            id: userIdStr, 
            email: session.user.email 
        });

        // Get all projects for the user
        const [inProgressProjects, completedProjects, archivedProjects] = await Promise.all([
            Project.find({
                $or: [
                    { client: userData._id },
                    { owner: userData._id }
                ],
                status: { $in: ['pending', 'in_progress'] }
            })
            .populate('client', 'name email image')
            .populate('contractor', 'name email image')
            .sort({ startDate: -1 })
            .lean(),
            
            Project.find({
                $or: [
                    { client: userData._id },
                    { owner: userData._id }
                ],
                status: 'completed'
            })
            .populate('client', 'name email image')
            .populate('contractor', 'name email image')
            .sort({ completionDate: -1 })
            .lean(),

            Project.find({
                $or: [
                    { client: userData._id },
                    { owner: userData._id }
                ],
                status: 'archived'
            })
            .populate('client', 'name email image')
            .populate('contractor', 'name email image')
            .sort({ updatedAt: -1 })
            .lean()
        ]);

        // Convert MongoDB documents to plain objects and stringify ObjectIds
        const serializedProjects = {
            inProgress: inProgressProjects.map(serializeDoc),
            completed: completedProjects.map(serializeDoc),
            archived: archivedProjects.map(serializeDoc),
            reviews: []
        };

        // Get reviews for completed projects
        const reviewDocs = await Review.find({
            'project._id': { 
                $in: serializedProjects.completed.map(p => p._id)
            }
        })
        .sort({ date: -1 })
        .lean();

        const reviews = reviewDocs.map(serializeDoc);

        serializedProjects.reviews = reviews;

        console.log('Found projects:', { 
            inProgress: serializedProjects.inProgress.length, 
            completed: serializedProjects.completed.length,
            archived: serializedProjects.archived.length,
            sample: serializedProjects.inProgress[0] ? {
                _id: serializedProjects.inProgress[0]._id,
                title: serializedProjects.inProgress[0].title,
                status: serializedProjects.inProgress[0].status,
                hasClient: !!serializedProjects.inProgress[0].client,
                hasOwner: !!serializedProjects.inProgress[0].owner,
                hasContractor: !!serializedProjects.inProgress[0].contractor
            } : null
        });

        return {
            projects: serializedProjects
        };
    } catch (err) {
        console.error('Error loading projects:', err);
        throw error(500, 'Failed to load projects');
    }
};

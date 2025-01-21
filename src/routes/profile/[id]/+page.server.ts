import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { connectDB } from '$lib/server/db';
import mongoose from 'mongoose';
import { getUserModel } from '$lib/server/models/user';
import { getProjectModel } from '$lib/server/models/project';
import { getReviewModel } from '$lib/server/models/review';
import { getUserInteractionModel } from '$lib/server/models/userInteraction';

// Helper function to serialize Mongoose documents
function serializeDocument(doc: any): any {
    if (!doc) return doc;

    // Handle arrays
    if (Array.isArray(doc)) {
        return doc.map(item => serializeDocument(item));
    }

    // Handle objects
    if (typeof doc === 'object') {
        const serialized: any = {};
        for (const [key, value] of Object.entries(doc)) {
            if (value instanceof mongoose.Types.ObjectId) {
                serialized[key] = value.toString();
            } else if (value instanceof Date) {
                serialized[key] = value.toISOString();
            } else if (typeof value === 'object' && value !== null) {
                serialized[key] = serializeDocument(value);
            } else {
                serialized[key] = value;
            }
        }
        return serialized;
    }

    return doc;
}

export const load: PageServerLoad = async ({ params, locals }) => {
    try {
        const session = await locals.auth();
        await connectDB();
        const User = getUserModel();
        const Project = getProjectModel();
        const Review = getReviewModel();
        const UserInteraction = getUserInteractionModel();
        
        // Get the professional's ID from the URL params
        const { id } = params;
        
        if (!id) {
            throw error(404, 'Professional not found');
        }

        // Fetch the professional's data
        const professional = await User.findOne({ 
            _id: new mongoose.Types.ObjectId(id),
            isPro: true 
        }).lean();

        if (!professional) {
            throw error(404, 'Professional not found');
        }

        // Check if the professional is saved by the current user
        let isSaved = false;
        if (session?.user?.id) {
            const interaction = await UserInteraction.findOne({
                userId: new mongoose.Types.ObjectId(session.user.id),
                targetId: new mongoose.Types.ObjectId(id),
                type: 'save',
                targetModel: 'Professional'
            }).lean();
            isSaved = !!interaction;
        }

        // Fetch their reviews
        const reviews = await Review.find({ 
            contractor: new mongoose.Types.ObjectId(id),
            status: 'published'
        }).lean();

        // Fetch their projects
        const projects = await Project.find({ 
            contractor: new mongoose.Types.ObjectId(id),
            status: 'completed'
        }).lean();

        return {
            session,
            professional: serializeDocument(professional),
            reviews: serializeDocument(reviews),
            projects: serializeDocument(projects),
            isSaved
        };
    } catch (err) {
        console.error('Error loading professional profile:', err);
        throw error(404, 'Professional not found');
    }
};

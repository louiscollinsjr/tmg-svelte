import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { connectDB } from '$lib/server/db';
import mongoose from 'mongoose';
import { getUserModel } from '$lib/server/models/user';
import { getProjectModel } from '$lib/server/models/project';
import { getReviewModel } from '$lib/server/models/review';

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

export const load: PageServerLoad = async ({ locals }) => {
    try {
        const session = await locals.auth();
        console.log('Session:', session);
        
        if (!session?.user) {
            console.log('No session user, redirecting');
            throw redirect(302, '/');
        }

        await connectDB();
        const User = getUserModel();
        const Project = getProjectModel();
        const Review = getReviewModel();
        
        // Try finding by _id first
        let userData = null;
        if (session.user.id) {
            console.log('Looking for user with _id:', session.user.id);
            try {
                userData = await User.findById(session.user.id).lean();
            } catch (e) {
                console.error('Error finding user by _id:', e);
            }
        }

        // If not found by _id, try email
        if (!userData && session.user.email) {
            console.log('Looking for user with email:', session.user.email);
            userData = await User.findOne({ email: session.user.email }).lean();
        }

        if (!userData) {
            console.log('No user data found');
            return {
                session,
                userData: null,
                projects: [],
                reviews: []
            };
        }

        // Fetch user's projects
        const projects = await Project.find({ 
            owner: new mongoose.Types.ObjectId(userData._id) 
        }).lean();

        // Fetch reviews where the user is either the owner or contractor
        const reviews = await Review.find({
            $or: [
                { owner: new mongoose.Types.ObjectId(userData._id) },
                { contractor: new mongoose.Types.ObjectId(userData._id) }
            ]
        })
        .sort({ createdAt: -1 })
        .lean();

        // Fetch related project details for the reviews
        const projectIds = reviews.map(review => review.project);
        const relatedProjects = await Project.find({ 
            _id: { $in: projectIds } 
        }).lean();

        // Create a map of project details
        const projectMap = relatedProjects.reduce((acc, project) => {
            acc[project._id.toString()] = project;
            return acc;
        }, {} as Record<string, any>);

        // Enrich reviews with project details
        const enrichedReviews = reviews.map(review => ({
            ...review,
            projectDetails: projectMap[review.project.toString()] || null
        }));

        return {
            session,
            userData: serializeDocument(userData),
            projects: serializeDocument(projects),
            reviews: serializeDocument(enrichedReviews)
        };
    } catch (error) {
        console.error('Error in profile load function:', error);
        throw error;
    }
};

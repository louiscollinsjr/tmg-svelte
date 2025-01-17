import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { connectToDatabase } from '$lib/server/db';
import { ObjectId } from 'mongodb';

// Helper function to serialize MongoDB documents
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
            if (value instanceof ObjectId) {
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

        const db = await connectToDatabase();
        
        // Try finding by _id first
        let userData = null;
        if (session.user.id) {
            console.log('Looking for user with _id:', session.user.id);
            try {
                userData = await db.collection('users').findOne({ _id: new ObjectId(session.user.id) });
            } catch (e) {
                console.error('Error finding user by _id:', e);
            }
        }

        // If not found by _id, try email
        if (!userData && session.user.email) {
            console.log('Looking for user with email:', session.user.email);
            userData = await db.collection('users').findOne({ email: session.user.email });
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
        const projects = await db.collection('projects')
            .find({ owner: new ObjectId(userData._id) })
            .toArray();

        // Fetch reviews where the user is either the owner or contractor
        const reviews = await db.collection('reviews')
            .find({
                $or: [
                    { owner: new ObjectId(userData._id) },
                    { contractor: new ObjectId(userData._id) }
                ]
            })
            .sort({ createdAt: -1 })
            .toArray();

        // Fetch related project details for the reviews
        const projectIds = reviews.map(review => review.project);
        const relatedProjects = await db.collection('projects')
            .find({ _id: { $in: projectIds } })
            .toArray();

        // Create a map of project details
        const projectMap = relatedProjects.reduce((acc, project) => {
            acc[project._id.toString()] = project;
            return acc;
        }, {});

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

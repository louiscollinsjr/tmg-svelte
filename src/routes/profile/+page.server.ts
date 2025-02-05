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

export const load: PageServerLoad = async ({ locals, cookies }) => {
    console.log('[Profile] Starting profile page load');
    try {
        const session = await locals.auth();
        console.log('[Profile] Session:', session);
        
        if (!session?.user) {
            console.log('[Profile] No session, redirecting to login');
            throw redirect(303, '/login');
        }

        // Check for saved project data
        const savedData = cookies.get('tempFormData');
        console.log('[Profile] Saved cookie data:', savedData);

        if (savedData) {
            try {
                console.log('[Profile] Processing saved project data');
                const formData = JSON.parse(decodeURIComponent(savedData));
                console.log('[Profile] Parsed form data:', formData);
                
                // Connect to DB
                console.log('[Profile] Connecting to database');
                await connectDB();
                const Project = getProjectModel();
                const User = getUserModel();

                // Find the user
                console.log('[Profile] Finding user with email:', session.user.email);
                const userData = await User.findOne({
                    email: session.user.email
                });

                if (!userData) {
                    console.error('[Profile] User not found in database');
                    cookies.delete('tempFormData', { path: '/' });
                    return {
                        session,
                        error: 'User not found'
                    };
                }

                console.log('[Profile] Found user:', userData._id);

                // Create the project
                console.log('[Profile] Creating new project');
                const project = new Project({
                    ...formData,
                    contractor: userData._id,
                    client: userData._id,
                    status: 'pending',
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                console.log('[Profile] Saving project:', project);
                await project.save();
                console.log('[Profile] Project saved successfully:', project._id);

                // Clear the saved data
                cookies.delete('tempFormData', { path: '/' });
                console.log('[Profile] Cleared saved project data');

                // Redirect to success page
                throw redirect(303, '/project/success');
            } catch (error) {
                console.error('[Profile] Error processing project:', error);
                cookies.delete('tempFormData', { path: '/' });
                return {
                    session,
                    error: error instanceof Error ? error.message : 'Unknown error occurred'
                };
            }
        }

        await connectDB();
        const User = getUserModel();
        const Project = getProjectModel();
        const Review = getReviewModel();
        
        // Try finding by _id first
        let userData = null;
        if (session.user.id) {
            try {
                userData = await User.findById(session.user.id).lean();
            } catch (e) {
                console.error('Error finding user by _id:', e);
            }
        }

        // If not found by _id, try email
        if (!userData && session.user.email) {
            userData = await User.findOne({ email: session.user.email }).lean();
        }

        if (!userData) {
            return {
                session,
                userData: null,
                projects: [],
                reviews: []
            };
        }

        // Fetch user's projects
        const projects = await Project.find({ 
            $or: [
                { client: new mongoose.Types.ObjectId(userData._id) },
                { owner: new mongoose.Types.ObjectId(userData._id) }
            ]
        }).lean();

        // Fetch reviews where the user is either the owner or contractor
        const reviews = await Review.find({
            $or: [
                { owner: new mongoose.Types.ObjectId(userData._id) },
                { contractor: new mongoose.Types.ObjectId(userData._id) }
            ]
        })
        .populate({
            path: 'contractor',
            select: 'name businessInfo.companyName image'
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
        console.error('[Profile] Error in profile load function:', error);
        throw error;
    }
};

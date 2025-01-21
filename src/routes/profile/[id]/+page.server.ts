import { error } from '@sveltejs/kit';
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

export const load: PageServerLoad = async ({ params, locals }) => {
    try {
        const session = await locals.auth();
        const db = await connectToDatabase();
        
        // Get the professional's ID from the URL params
        const { id } = params;
        
        if (!id) {
            throw error(404, 'Professional not found');
        }

        // Fetch the professional's data
        const professional = await db.collection('users').findOne({ 
            _id: new ObjectId(id),
            isPro: true 
        });

        if (!professional) {
            throw error(404, 'Professional not found');
        }

        // Check if the professional is saved by the current user
        let isSaved = false;
        if (session?.user?.id) {
            const interaction = await db.collection('userinteractions').findOne({
                userId: new ObjectId(session.user.id),
                targetId: new ObjectId(id),
                type: 'save',
                targetModel: 'Professional'
            });
            isSaved = !!interaction;
        }

        // Fetch their reviews
        const reviews = await db.collection('reviews')
            .find({ 
                contractor: new ObjectId(id),
                status: 'published'
            })
            .toArray();

        // Fetch their projects
        const projects = await db.collection('projects')
            .find({ 
                contractor: new ObjectId(id),
                status: 'completed'
            })
            .toArray();

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

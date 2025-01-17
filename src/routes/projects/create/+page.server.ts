import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { connectToDatabase } from '$lib/server/db';
import { ObjectId } from 'mongodb';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth();
    
    if (!session?.user) {
        throw redirect(302, '/');
    }

    return {
        session
    };
};

export const actions = {
    create: async ({ request, locals }) => {
        const session = await locals.auth();
        
        if (!session?.user) {
            return { success: false, error: 'Not authenticated' };
        }

        const formData = await request.formData();
        const title = formData.get('title')?.toString();
        const description = formData.get('description')?.toString();
        const budget = Number(formData.get('budget'));
        const timeline = formData.get('timeline')?.toString();
        const location = formData.get('location')?.toString();
        const tags = formData.getAll('tags').map(tag => tag.toString());
        
        if (!title || !description || !budget || !timeline || !location) {
            return {
                success: false,
                error: 'All required fields must be filled'
            };
        }

        const db = await connectToDatabase();
        
        // Get user data to ensure we have the correct ObjectId
        const userData = await db.collection('users').findOne({ 
            $or: [
                { _id: new ObjectId(session.user.id) },
                { email: session.user.email }
            ]
        });

        if (!userData) {
            return {
                success: false,
                error: 'User not found'
            };
        }

        const project = {
            title,
            description,
            owner: userData._id,
            status: 'planning',
            tags,
            images: [],
            metadata: {
                budget,
                timeline,
                location
            },
            interactions: {
                views: 0,
                saves: 0,
                lastViewed: new Date(),
                viewHistory: [],
                savedBy: []
            },
            milestones: [],
            updates: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        try {
            const result = await db.collection('projects').insertOne(project);
            
            if (result.acknowledged) {
                throw redirect(303, `/projects/${result.insertedId}`);
            }

            return {
                success: true,
                projectId: result.insertedId
            };
        } catch (error) {
            console.error('Error creating project:', error);
            return {
                success: false,
                error: 'Failed to create project'
            };
        }
    }
} satisfies Actions;

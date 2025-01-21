import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { connectDB } from '$lib/server/db';
import mongoose from 'mongoose';
import { getUserModel } from '$lib/server/models/user';
import { getProjectModel } from '$lib/server/models/project';

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

        await connectDB();
        const User = getUserModel();
        const Project = getProjectModel();
        
        // Get user data to ensure we have the correct ObjectId
        const userData = await User.findOne({ 
            $or: [
                { _id: new mongoose.Types.ObjectId(session.user.id) },
                { email: session.user.email }
            ]
        }).lean();

        if (!userData) {
            return {
                success: false,
                error: 'User not found'
            };
        }

        const project = new Project({
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
        });

        try {
            const savedProject = await project.save();
            throw redirect(303, `/projects/${savedProject._id}`);
        } catch (error) {
            console.error('Error creating project:', error);
            return {
                success: false,
                error: 'Failed to create project'
            };
        }
    }
} as Actions;

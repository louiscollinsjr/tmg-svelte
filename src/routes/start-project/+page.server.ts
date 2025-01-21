import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { connectDB } from '$lib/server/db';
import mongoose from 'mongoose';
import { getUserModel } from '$lib/server/models/user';
import { getProjectModel } from '$lib/server/models/project';
import { getUserInteractionModel } from '$lib/server/models/userInteraction';

// Import the ServiceCategory model
const serviceCategorySchema = new mongoose.Schema({
    name: String,
    slug: String,
    icon: String,
    description: String,
    options: [{
        id: String,
        name: String,
        slug: String,
        description: String,
        popular: Boolean
    }]
});

const ServiceCategory = mongoose.models.ServiceCategory || 
    mongoose.model('ServiceCategory', serviceCategorySchema);

export const load: PageServerLoad = async ({ locals }) => {
    try {
        await connectDB();
        
        // Fetch service categories for the form
        const serviceCategories = await ServiceCategory.find({}).lean();

        return {
            serviceCategories: serviceCategories.map(category => ({
                _id: category._id.toString(),
                name: category.name
            }))
        };
    } catch (err) {
        console.error('Error loading service categories:', err);
        throw error(500, 'Failed to load service categories');
    }
};

export const actions: Actions = {
    createProject: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user?.id) {
            throw error(401, 'Must be logged in to create a project');
        }

        try {
            const formData = await request.formData();
            await connectDB();
            const Project = getProjectModel();
            const UserInteraction = getUserInteractionModel();

            // Create the project document
            const project = new Project({
                title: formData.get('title'),
                description: formData.get('description'),
                owner: new mongoose.Types.ObjectId(session.user.id),
                status: 'planning',
                tags: [formData.get('projectType')],
                images: JSON.parse(formData.get('images')?.toString() || '[]'),
                metadata: {
                    budget: formData.get('budget'),
                    timeline: formData.get('timeline'),
                    location: `${formData.get('city')}, ${formData.get('state')}`
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

            const savedProject = await project.save();

            // Create initial interaction
            const interaction = new UserInteraction({
                userId: new mongoose.Types.ObjectId(session.user.id),
                type: 'create',
                targetId: savedProject._id,
                targetModel: 'Project',
                metadata: {
                    source: 'project-wizard',
                    status: 'planning'
                },
                createdAt: new Date()
            });

            await interaction.save();
            return { success: true, projectId: savedProject._id.toString() };
        } catch (err) {
            console.error('Error creating project:', err);
            throw error(500, 'Failed to create project');
        }
    }
};

import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { connectToDatabase } from '$lib/server/db';
import { ObjectId } from 'mongodb';

export const load: PageServerLoad = async ({ locals }) => {
    try {
        const db = await connectToDatabase();
        
        // Fetch service categories for the form
        const serviceCategories = await db.collection('servicecategories').find({}).toArray();

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
            const db = await connectToDatabase();

            // Create the project document
            const projectData = {
                title: formData.get('title'),
                description: formData.get('description'),
                owner: new ObjectId(session.user.id),
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
            };

            const result = await db.collection('projects').insertOne(projectData);

            if (result.acknowledged) {
                // Create initial interaction
                await db.collection('userinteractions').insertOne({
                    userId: new ObjectId(session.user.id),
                    type: 'create',
                    targetId: result.insertedId,
                    targetModel: 'Project',
                    metadata: {
                        source: 'project-wizard',
                        status: 'planning'
                    },
                    createdAt: new Date()
                });

                return { success: true, projectId: result.insertedId.toString() };
            } else {
                throw error(500, 'Failed to create project');
            }
        } catch (err) {
            console.error('Error creating project:', err);
            throw error(500, 'Failed to create project');
        }
    }
};

import type { PageServerLoad, Actions } from './$types';
import { getUserModel } from '$lib/server/models/user';
import { getProjectModel } from '$lib/server/models/project';
import { connectDB } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import mongoose from 'mongoose';

function toJSON(obj: any): any {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(toJSON);
    }

    if (typeof obj === 'object') {
        if (obj instanceof mongoose.Types.ObjectId) {
            return obj.toString();
        }

        if (obj instanceof Date) {
            return obj.toISOString();
        }

        const result: any = {};
        for (const [key, value] of Object.entries(obj)) {
            result[key] = toJSON(value);
        }
        return result;
    }

    return obj;
}

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth();
    let isPro = false;
    let pendingProjects = [];

    if (session?.user) {
        try {
            await connectDB();
            const User = getUserModel();
            const Project = getProjectModel();
            
            const userData = await User.findById(session.user.id).lean();
            isPro = userData?.isPro || false;

            if (isPro) {
                console.log('User is pro, fetching pending projects...');
                
                // First check if we have any projects at all
                const allProjects = await Project.find({}).lean();
                console.log('Total projects in database:', allProjects.length);
                
                // Modified query to show all pending projects
                const projects = await Project.find({ 
                    status: 'pending',
                })
                .populate('client', 'name email')
                .lean();

                // Convert to plain JSON
                pendingProjects = toJSON(projects);
                
                console.log('Found pending projects:', pendingProjects.length);
            } else {
                console.log('User is not pro, skipping project fetch');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    return {
        session,
        isPro,
        pendingProjects
    };
};

export const actions: Actions = {
    acceptProject: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user) {
            throw error(401, 'Unauthorized');
        }

        try {
            await connectDB();
            const Project = getProjectModel();

            const formData = await request.formData();
            const projectId = formData.get('projectId')?.toString();

            if (!projectId) {
                throw error(400, 'Project ID is required');
            }

            const project = await Project.findById(projectId);
            if (!project) {
                throw error(404, 'Project not found');
            }

            if (project.status !== 'pending') {
                throw error(400, 'Project is no longer available');
            }

            // Update project status and assign contractor
            project.status = 'in_progress';
            project.contractor = session.user.id;
            await project.save();

            return { success: true };
        } catch (e) {
            console.error('Error accepting project:', e);
            throw error(500, 'Failed to accept project');
        }
    }
};

import type { PageServerLoad } from './$types';
import { getProjectModel } from '$lib/server/models/project';
import { getReviewModel } from '$lib/server/models/review';
import { error } from '@sveltejs/kit';
import mongoose from 'mongoose';

export const load: PageServerLoad = async ({ params, locals }) => {
    const session = await locals.getSession();
    if (!session?.user?.email) {
        throw error(401, 'Unauthorized');
    }

    try {
        const Project = getProjectModel();
        const Review = getReviewModel();

        console.log('Loading project:', { 
            id: params.id,
            userEmail: session.user.email 
        });

        // Get project details with populated fields
        const project = await Project.findById(params.id)
            .populate('client', 'name email image')
            .populate('contractor', 'name email image')
            .lean();
        
        if (!project) {
            console.log('Project not found:', params.id);
            throw error(404, 'Project not found');
        }

        // Convert MongoDB ObjectIds to strings
        const serializedProject = JSON.parse(JSON.stringify(project));
        if (serializedProject._id) {
            serializedProject._id = serializedProject._id.toString();
        }

        // Verify user has access to this project
        const userEmail = session.user.email;
        const userIdStr = project.client?._id?.toString();

        // Check access based on email or ID
        const isClient = project.client?.email === userEmail || 
                        project.client?.toString() === userIdStr;
        const isContractor = project.contractor?.email === userEmail || 
                            project.contractor?.toString() === userIdStr;

        console.log('Access check:', {
            userEmail,
            userIdStr,
            isClient,
            isContractor,
            clientInfo: {
                id: project.client?._id?.toString() || project.client?.toString(),
                email: project.client?.email
            },
            contractorInfo: {
                id: project.contractor?._id?.toString() || project.contractor?.toString(),
                email: project.contractor?.email
            }
        });

        if (!isClient && !isContractor) {
            console.log('Access denied:', {
                userEmail,
                userIdStr,
                clientInfo: {
                    id: project.client?._id?.toString() || project.client?.toString(),
                    email: project.client?.email
                },
                contractorInfo: {
                    id: project.contractor?._id?.toString() || project.contractor?.toString(),
                    email: project.contractor?.email
                }
            });
            throw error(403, 'Forbidden');
        }

        // Get reviews for this project
        const reviewDocs = await Review.find({
            'project._id': project._id
        })
        .populate('reviewer', 'name email image')
        .sort({ date: -1 })
        .lean();

        const reviews = reviewDocs.map(review => {
            const serialized = JSON.parse(JSON.stringify(review));
            if (serialized._id) {
                serialized._id = serialized._id.toString();
            }
            if (serialized.project?._id) {
                serialized.project._id = serialized.project._id.toString();
            }
            return serialized;
        });

        console.log('Project loaded successfully:', {
            id: serializedProject._id,
            title: serializedProject.title,
            hasClient: !!serializedProject.client,
            hasContractor: !!serializedProject.contractor,
            reviewCount: reviews.length,
            userRole: isClient ? 'client' : 'contractor'
        });

        return {
            project: serializedProject,
            reviews
        };
    } catch (err) {
        console.error('Error loading project:', err);
        throw error(500, 'Failed to load project');
    }
};

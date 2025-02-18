import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getProjectModel } from '$lib/server/models/project';
import { getUserModel } from '$lib/server/models/user';
import { getReviewModel } from '$lib/server/models/review';

export const load: PageServerLoad = async ({ url }) => {
    const projectId = url.searchParams.get('projectId');
    
    if (!projectId) {
        throw error(400, 'Project ID is required');
    }

    const Project = getProjectModel();

    try {
        const project = await Project.findById(projectId)
            .populate('contractor', 'name image')
            .lean();

        if (!project) {
            throw error(404, 'Project not found');
        }

        // Serialize the project data
        const serializedProject = {
            ...project,
            _id: project._id.toString(),
            owner: project.owner?.toString(),
            contractor: project.contractor ? {
                _id: project.contractor._id.toString(),
                name: project.contractor.name,
                image: project.contractor.image
            } : null,
            createdAt: project.createdAt?.toISOString(),
            updatedAt: project.updatedAt?.toISOString(),
            timeline: project.timeline ? {
                ...project.timeline,
                startDate: project.timeline.startDate?.toISOString(),
                completedDate: project.timeline.completedDate?.toISOString()
            } : null
        };

        return {
            project: serializedProject
        };
    } catch (e) {
        console.error('Error loading project:', e);
        throw error(404, 'Invalid project ID or project not found');
    }
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const formData = await request.formData();
        const projectId = formData.get('projectId') as string;
        const rating = parseInt(formData.get('rating') as string);
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const images = formData.getAll('images') as File[];

        if (!projectId || !rating || !title || !content) {
            return fail(400, {
                error: 'All fields are required'
            });
        }

        const Project = getProjectModel();
        const Review = getReviewModel();
        const session = await locals.getSession();

        if (!session?.user) {
            return fail(401, {
                error: 'You must be logged in to leave a review'
            });
        }

        try {
            const project = await Project.findById(projectId);
            if (!project) {
                return fail(404, {
                    error: 'Project not found'
                });
            }

            // Upload images and get URLs
            const imageUrls = await Promise.all(
                images.map(async (file) => {
                    // TODO: Implement actual image upload
                    // For now, return a placeholder URL
                    return {
                        url: 'https://picsum.photos/800/600',
                        caption: file.name
                    };
                })
            );

            const review = await Review.create({
                project: projectId,
                owner: session.user.id,
                contractor: project.contractor,
                rating,
                title,
                content,
                status: 'published',
                helpful: {
                    count: 0,
                    users: []
                },
                images: imageUrls,
                responses: [],
                metadata: {
                    projectStage: project.status,
                    completionDate: project.timeline?.completedDate,
                    verifiedPurchase: true,
                    categories: [project.category]
                },
                moderation: {
                    reportCount: 0,
                    reportedBy: [],
                    reportReasons: []
                }
            });

            return {
                success: true,
                reviewId: review._id.toString()
            };
        } catch (e) {
            console.error('Error creating review:', e);
            return fail(500, {
                error: 'Failed to create review'
            });
        }
    }
};

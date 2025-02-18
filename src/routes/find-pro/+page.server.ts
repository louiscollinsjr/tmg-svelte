import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserModel } from '$lib/server/models/user';
import { getServiceCategoryModel } from '$lib/server/models/serviceCategory';
import { getProjectModel } from '$lib/server/models/project';

// Helper function to convert any ObjectIds to strings in an object
function serializeObjectIds(obj: any): any {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => serializeObjectIds(item));
    }

    if (typeof obj === 'object') {
        if (obj._id && typeof obj._id.toString === 'function') {
            obj = { ...obj, _id: obj._id.toString() };
        }
        
        const result: any = {};
        for (const [key, value] of Object.entries(obj)) {
            result[key] = serializeObjectIds(value);
        }
        return result;
    }

    return obj;
}

export const load: PageServerLoad = async ({ url }) => {
    const projectId = url.searchParams.get('projectId');
    const categorySlug = url.searchParams.get('category');

    if (!projectId && !categorySlug) {
        throw error(400, 'Either projectId or category parameter is required');
    }

    const User = getUserModel();
    const ServiceCategory = getServiceCategoryModel();
    const Project = getProjectModel();

    let categoryToFilter = categorySlug;

    // If projectId is provided, get the category from the project
    if (projectId) {
        try {
            const project = await Project.findById(projectId).lean();
            if (!project) {
                throw error(404, 'Project not found');
            }
            categoryToFilter = project.category;
        } catch (e) {
            throw error(404, 'Invalid project ID or project not found');
        }
    }

    if (!categoryToFilter) {
        throw error(404, 'Category not found');
    }

    // Get professionals based on the category
    const query = {
        isPro: true,
        status: 'active',
        'preferences.visibility': 'public',
        'selectedServices.categoryId': categoryToFilter
    };

    console.log('Finding professionals with query:', JSON.stringify(query, null, 2));
    const professionalsDocs = await User.find(query).lean();
    console.log(`Found ${professionalsDocs.length} professionals`);

    const professionals = serializeObjectIds(professionalsDocs);

    return {
        professionals,
        selectedCategory: { slug: categoryToFilter } // Just return the slug since we don't need the full category object
    };
};

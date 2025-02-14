import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, parent }) => {
    const session = await locals.getSession();
    if (!session?.user?.email) {
        throw redirect(302, '/login');
    }

    // Get the root layout data
    const parentData = await parent();
    
    // If no user data, redirect to login
    if (!parentData.userData) {
        throw redirect(302, '/login');
    }

    return {
        session,
        userData: parentData.userData,
        savedItems: parentData.savedItems
    };
};

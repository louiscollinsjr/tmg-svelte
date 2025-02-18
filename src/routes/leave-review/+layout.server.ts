import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
    const session = await locals.getSession();
    if (!session?.user?.email) {
        throw redirect(302, '/login');
    }

    return {
        hideRootLayout: true
    };
};

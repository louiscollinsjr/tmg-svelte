import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    // We don't need to redirect here since the page.server.ts will handle auth
    const session = await locals.auth();
    
    return {
        user: session?.user
    };
};

import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth();
    
    // Redirect to home if already authenticated
    if (session?.user) {
        throw redirect(303, '/');
    }

    return {
        url: event.url.origin
    };
};

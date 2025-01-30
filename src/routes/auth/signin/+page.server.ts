// src/routes/auth/signin/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';


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

export const actions: Actions = {
    default: async (event) => {
        console.log('[Server] 🔐 Processing sign-in request');

        // Get the 'ref' query parameter
        const ref = event.url.searchParams.get('ref');
        const callbackUrl = ref ? `/auth/callback?ref=${ref}` : '/auth/callback';

        try {
            // Sign in with the 'google' provider and specify the callback URL
            const signInResponse = await event.locals.auth.signIn('google', { redirectTo: callbackUrl });

            // Log the redirect URL and throw a redirect
            console.log(`[Server] 🔄 Redirecting to: ${signInResponse?.url}`);
            throw redirect(302, signInResponse?.url ?? '/');
        } catch (error) {
            // Log any errors and redirect to the error page
            console.error('[Server] ❌ Sign-in error:', error);
            throw redirect(302, '/auth/error');
        }
    }
};
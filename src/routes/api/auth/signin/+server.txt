// src/routes/api/auth/signin/+server.ts
import { authHandler } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
    console.log('[Server] 🔐 Processing sign-in request');
    try {
        const url = await authHandler.signIn("google", event);
        if (!url) {
            console.log('[Server] ⚠️ No URL returned, redirecting to error page');
            throw redirect(302, '/auth/error');
        }
        console.log(`[Server] ✅ Sign-in successful, redirecting to: ${url.toString()}`);
        throw redirect(302, url.toString());
    } catch (error) {
        console.error('[Server] ❌ Sign-in error:', error);
        throw redirect(302, '/auth/error');
    }
};
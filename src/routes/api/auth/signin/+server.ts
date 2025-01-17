// src/routes/api/auth/signin/+server.ts
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '@auth/sveltekit';

export const GET = auth((event) => {
    throw redirect(302, '/auth/error');
}) satisfies RequestHandler;
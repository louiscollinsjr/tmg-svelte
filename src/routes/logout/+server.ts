// src/routes/logout/+server.ts
import { authHandler } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
    const url = await authHandler.signOut() ?? '/';
    throw redirect(302, url);
};
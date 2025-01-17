// src/hooks.server.ts
import { authHandler } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { i18n } from '$lib/i18n';

const handleParaglide: Handle = i18n.handle();

const handleAuth = (async ({ event, resolve }) => {
    return await authHandler(event, resolve);
}) satisfies Handle;

export const handle = sequence(handleParaglide, handleAuth);
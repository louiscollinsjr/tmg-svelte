// src/hooks.server.ts
import { authHandler } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { i18n } from '$lib/i18n';

const handleParaglide: Handle = i18n.handle();

const handleAuth: Handle = async ({ event, resolve }) => {
    const response = await authHandler.handle({ event, resolve });
    return response;
};

const handleSession: Handle = async ({ event, resolve }) => {
    if (!event.locals.auth) {
        return await resolve(event);
    }
    
    const session = await event.locals.auth();
    event.locals.session = session;
    return await resolve(event);
};

const handleLogging: Handle = async ({ event, resolve }) => {
    console.log(`[Server] 🎯 Incoming request to: ${event.url.pathname}`);
    try {
        const response = await resolve(event);
        if (response.status >= 300 && response.status < 400) {
            const location = response.headers.get('location');
            console.log(`[Server] 🔄 Redirect: ${event.url.pathname} -> ${location}`);
        }
        return response;
    } catch (error) {
        if (error && typeof error === 'object' && 'status' in error && error.status >= 300 && error.status < 400) {
            console.log(`[Server] 🔄 Redirect (from error): ${event.url.pathname} -> ${error.location}`);
        }
        throw error;
    }
};

export const handle = sequence(handleLogging, handleParaglide, handleAuth, handleSession);
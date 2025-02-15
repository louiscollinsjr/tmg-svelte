// src/hooks.server.ts
import { authHandler } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { i18n } from '$lib/i18n';
import { handleFormSession } from '$lib/server/formSession';
import { ensureDbConnected } from '$lib/server/db';

const handleParaglide: Handle = i18n.handle();

// Add database connection handler
const handleDatabase: Handle = async ({ event, resolve }) => {
    try {
        await ensureDbConnected();
    } catch (error) {
        console.error('Failed to connect to database:', error);
        return new Response('Database connection failed', { status: 500 });
    }
    return await resolve(event);
};

export const handleAuth: Handle = async ({ event, resolve }) => {
    // Skip authentication for error routes
    if (event.url.pathname.startsWith('/auth/error')) {
        return await resolve(event);
    }
    const response = await authHandler.handle({ event, resolve });
    return response;
};

// src/hooks.server.ts
const handleSession: Handle = async ({ event, resolve }) => {
    console.log('Session check started');
    
    if (!event.locals.auth) {
        console.log('No auth found in locals');
        return await resolve(event);
    }
    
    const session = await event.locals.auth();
    console.log('Session data:', session);
    
    event.locals.session = session;
    return await resolve(event);
};

const handleFormData: Handle = async ({ event, resolve }) => {
    return handleFormSession({ event, resolve });
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

export const handle = sequence(handleLogging, handleParaglide, handleDatabase, handleAuth, handleSession, handleFormData);
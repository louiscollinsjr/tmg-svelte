// src/lib/server/formSession.ts
import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const handleFormSession: Handle = async ({ event, resolve }) => {
    const formSessionId = event.cookies.get('form_session');
    
    // Add form session handling to locals
    event.locals.formSession = {
        get: async () => {
            if (!formSessionId) return null;
            // Implement your storage solution here (Redis, DB, etc.)
            return JSON.parse(event.cookies.get('form_data') || 'null');
        },
        set: async (data: any) => {
            const sessionId = crypto.randomUUID();
            // In development, use cookies. In production, use proper storage
            if (dev) {
                event.cookies.set('form_data', JSON.stringify(data), {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: !dev,
                    maxAge: 60 * 30 // 30 minutes
                });
            } else {
                // Implement your storage solution here
            }
            event.cookies.set('form_session', sessionId, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                secure: !dev,
                maxAge: 60 * 30 // 30 minutes
            });
        },
        clear: async () => {
            event.cookies.delete('form_session', { path: '/' });
            event.cookies.delete('form_data', { path: '/' });
        }
    };

    return await resolve(event);
};
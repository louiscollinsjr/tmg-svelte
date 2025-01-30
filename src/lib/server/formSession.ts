// src/lib/server/formSession.ts
import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { ProjectFormData } from '$lib/types/project';

// Helper function to convert File to Base64
const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

export const handleFormSession: Handle = async ({ event, resolve }) => {
    const formSessionId = event.cookies.get('form_session');

    event.locals.formSession = {
        get: async () => {
            if (!formSessionId) return null;
            const rawData = event.cookies.get('form_data');
             if (!rawData) return null;

             const parsedData = JSON.parse(rawData);

             // Convert Base64 strings back to File objects (if necessary)
             if (parsedData.images && Array.isArray(parsedData.images)) {
                 parsedData.images = await Promise.all(
                     parsedData.images.map(async (imageData: any) => { // Assuming an object with name and data
                         if (imageData.type === 'base64') {
                             const response = await fetch(imageData.data);
                             const blob = await response.blob();
                             return new File([blob], imageData.name, { type: blob.type });
                         } else {
                             return imageData; // Return as is if not base64 encoded
                         }
                     })
                 );
             }

             return parsedData as ProjectFormData | null;
        },
        set: async (data: ProjectFormData) => {
            const sessionId = crypto.randomUUID();

            // Convert File objects to Base64 (if necessary)
            let processedData = { ...data };
            if (data.images && Array.isArray(data.images)) {
                 processedData.images = await Promise.all(
                     data.images.map(async (file) => {
                         if (file instanceof File) {
                             return {
                                 type: 'base64',
                                 name: file.name,
                                 data: await toBase64(file)
                             };
                         } else {
                             return file; // Return as is if not a File object
                         }
                     })
                 );
             }

            if (dev) {
                event.cookies.set('form_data', JSON.stringify(processedData), {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: !dev,
                    maxAge: 60 * 30 // 30 minutes
                });
            } else {
                // Implement your persistent storage logic here (e.g., database)
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
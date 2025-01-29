// src/routes/+page.server.ts
import { superValidate, message } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { combinedSchema } from './schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const session = locals.session;
    const form = await superValidate(zod(combinedSchema));
    
    // Check for existing form data in session
    const savedFormData = await locals.formSession.get();
    if (savedFormData) {
        form.data = savedFormData;
    }
    
    return { 
        form,
        session 
    };
};


export const actions: Actions = {
    default: async ({ request, locals }) => {
        const session = locals.session;
        const form = await superValidate(request, zod(combinedSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            if (!session?.user) {
                // Store form data in session
                await locals.formSession.set(form.data);
                
                // Redirect to sign in
                throw redirect(303, '/auth/signin');
            }

            // Save project to database
            await saveProject(form.data, session.user);
            
            // Clear form session
            await locals.formSession.clear();
            
            // Redirect to success page
            throw redirect(303, '/project/success');
        } catch (e) {
            if (e instanceof redirect) throw e;
            return fail(500, { form, message: 'Failed to save project' });
        }
    }
};


// export const actions = {
// 	default: async ({ request }) => {
// 		const form = await superValidate(request, zod(combinedSchema));

// 		console.log(form);

// 		if (!form.valid) return fail(400, { form });

// 		return message(form, 'Form posted successfully!');
// 	}
// };

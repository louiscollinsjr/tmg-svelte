// src/routes/start-project/+page.server.ts
import { superValidate, message } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { combinedSchema } from './schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { connectDB } from '$lib/server/db';
import { getProjectModel } from '$lib/server/models/project';
import { getUserModel } from '$lib/server/models/user';
import mongoose from 'mongoose';
import type { ProjectFormData } from '$lib/types/project';

export const load: PageServerLoad = async ({ locals, url }) => {
	const session = await locals.auth();
	const form = await superValidate(zod(combinedSchema));

	// Check for existing form data in session
	const savedFormData = await locals.formSession.get();
	if (savedFormData) {
		form.data = savedFormData;
	}

	// Check if the user was redirected from signin with the 'ref' query parameter
	const redirectedFromSignIn = url.searchParams.get('ref') === 'start-project';

	return {
		form,
		session,
		redirectedFromSignIn
	};
};

export const actions: Actions = {
    submitProject: async ({ request, locals }) => {
        const session = await locals.auth();
        const form = await superValidate(request, zod(combinedSchema));

        console.log('Received form data in submitProject:', form);

        if (!form.valid) {
            console.error('Form validation failed on server:', form.errors);
            return fail(400, { form });
        }

        if (!session?.user) {
            // Store form data in session
            await locals.formSession.set(form.data);

            // Redirect to sign in with a 'ref' query parameter
            throw redirect(303, '/auth/signin?ref=start-project');
        }

        try {
            // Save project to database using form.data
            await saveProject(form.data, session.user);

            // Clear form session
            await locals.formSession.clear();

             // Redirect to success page using a return statement
             return {
                status: 303,
                headers: {
                    location: '/project/success'
                }
            };
        } catch (e) {
            // Now only actual errors will be logged here
            console.error('Error in submitProject:', e); 
            return message(form, 'Failed to save project', { status: 500 });
        }
    }
};

async function saveProject(formData: ProjectFormData, user: any) {
    console.log('saveProject called with data:', formData); // Log data to check the budget value
    await connectDB();
    const Project = getProjectModel();
    const User = getUserModel();

    // Find the user by ID or email
    const userData = await User.findOne({
        $or: [
            { _id: new mongoose.Types.ObjectId(user.id) },
            { email: user.email }
        ]
    }).lean();

    if (!userData) {
        throw new Error('User not found');
    }


    // Create a new project using the form data and user ID
    const project = new Project({
        contractor: userData._id, // Assuming the user is the contractor
        client: userData._id,     // Assuming the user is also the client
        title: "New Project",    // Get this from the form data if available
        description: formData.description,
        status: 'pending',
        budget: formData.budget, // Now a number
        timeline: formData.timeline,
        images: [],              // Handle image uploads later
        city: formData.city,
        state: formData.state,
        zipcode: formData.zipcode,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    // Save the project
    await project.save();
}
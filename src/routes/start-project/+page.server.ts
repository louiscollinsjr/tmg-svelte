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
import type { ProjectFormData } from '$lib/types/project'; // Optional, but improves clarity

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
    default: async ({ request, locals, url }) => {
        const session = await locals.auth();
        const form = await superValidate(request, zod(combinedSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            if (!session?.user) {
                // Store form data in session
                await locals.formSession.set(form.data);

                // Redirect to sign in with a 'ref' query parameter
                throw redirect(303, '/auth/signin?ref=start-project');
            }

            // Save project to database
            await saveProject(form.data, session.user);

            // Clear form session
            await locals.formSession.clear();

            // Redirect to success page
            throw redirect(303, '/project/success');
        } catch (e) {
            if (e instanceof redirect) throw e;
            return message(form, 'Failed to save project', { status: 500 });
        }
    }
};

async function saveProject(formData: ProjectFormData, user: any) {
    console.log('saveProject called with data:', formData); // Log data
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
        title: "New Project",    // You might want to get this from the form data
        description: formData.description,
        status: 'pending',
        budget: formData.budget,
        timeline: {
            startDate: new Date() // You might want to get this from the form data
        },
        images: [],              // You might want to handle image uploads
        createdAt: new Date(),
        updatedAt: new Date()
    });

    // Save the project
    await project.save();
}
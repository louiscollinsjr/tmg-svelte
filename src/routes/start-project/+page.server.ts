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
		// Remove url
		const session = await locals.auth();
		const form = await superValidate(request, zod(combinedSchema));

		console.log('Received form data in submitProject:', form); // Log the form

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
			// Pass form.data to saveProject
			await saveProject(form.data, session.user);

			// Clear form session
			await locals.formSession.clear();

			// Redirect to success page
			throw redirect(303, '/project/success');
		} catch (e) {
			if (e instanceof redirect) throw e;
			console.error('Error in submitProject:', e); // Log the error
			return message(form, 'Failed to save project', { status: 500 });
		}
	}
};

async function saveProject(formData: ProjectFormData, user: any) {
	console.log('saveProject called with data:', formData);
	await connectDB();
	const Project = getProjectModel();
	const User = getUserModel();

	// Find the user by ID or email
	const userData = await User.findOne({
		$or: [{ _id: new mongoose.Types.ObjectId(user.id) }, { email: user.email }]
	}).lean();

	if (!userData) {
		throw new Error('User not found');
	}

	// <option value="">When do you want to start?</option>
	// <option value="0w">Right away</option>
	// <option value="14w">In 2 weeks</option>
	// <option value="1m">In 1 month</option>
	// <option value="2m">In 2 months</option>
	// <option value="6m">Still planning</option>

// Calculate startDate based on timeline value
let startDate = new Date(); // Default to today
switch (formData.timeline) {
    case '0w':
        // startDate remains today
        break;
    case '2w':
        startDate.setDate(startDate.getDate() + 14); // Add 14 days (2 week)
        break;
    case '1m':
        startDate.setMonth(startDate.getMonth() + 1); // Add 1 month
        break;
    case '2m':
        startDate.setMonth(startDate.getMonth() + 2); // Add 2 months
        break;
     case '6m':
        startDate.setMonth(startDate.getMonth() + 6); // Add 6 months for planning
        break;
    default:
        startDate.setDate(startDate.getDate() + 14); // Add 14 days (2 week)
        break;
}



	// Create a new project using the form data and user ID
	const project = new Project({
		contractor: userData._id, // Assuming the user is the contractor
		client: userData._id, // Assuming the user is also the client
		title: 'New Project', // You might want to get this from the form data
		description: formData.description,
		status: 'pending',
		budget: formData.budget,
		timeline: {
            startDate: startDate,
            endDate: null, // You might not have this initially
            completedDate: null // You wouldn't have this on creation
        },
		images: [], // You might want to handle image uploads
		createdAt: new Date(),
		updatedAt: new Date()
	});

	// Save the project
	await project.save();
}

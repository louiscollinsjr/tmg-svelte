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

		try {
			console.log('Received form data in submitProject:', form);

			if (!form.valid) {
				console.error('Form validation failed on server:', form.errors);
				return fail(400, { form }); // Return the invalid form
			}

			if (!session?.user) {
				// Store form data in session
				await locals.formSession.set(form.data);

				// Return both form data and redirect
				return {
					form,
					status: 303,
					headers: { location: '/auth/signin?ref=start-project' }
				};
			}

			// Save project to database using form.data
			const savedProject = await saveProject(form.data, session.user);

			// Clear form session
			await locals.formSession.clear();

			// Return success
			return { form, success: true };
		} catch (e) {
			console.error('Error in submitProject:', e);
			// Return a more detailed error message to the client
			return fail(500, {
				form: {
					...form,
					errors: { server: e.message || 'Failed to save project' }
				}
			});
		}
	}
};

async function saveProject(formData: ProjectFormData, user: any) {
	try {
		console.log('saveProject called with data:', formData);
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

		// Ensure budget is a number
		const budget = typeof formData.budget === 'string' 
			? parseFloat(formData.budget) 
			: (formData.budget || 0);

		if (isNaN(budget)) {
			throw new Error('Invalid budget value');
		}

		// Create timeline with proper date objects
		const timeline = {
			startDate: formData.timeline?.startDate ? new Date(formData.timeline.startDate) : new Date(),
			endDate: formData.timeline?.endDate ? new Date(formData.timeline.endDate) : undefined,
			completedDate: formData.timeline?.completedDate ? new Date(formData.timeline.completedDate) : undefined
		};

		// Create a new project using the form data and user ID
		const project = new Project({
			contractor: userData._id,
			client: userData._id,
			title: formData.projectTypes || "New Project",
			description: formData.description || '',
			status: 'pending',
			budget: budget,
			timeline: timeline,
			images: [], // Handle image uploads later
			city: formData.city || '',
			state: formData.state || '',
			zipcode: formData.zipcode || '',
			createdAt: new Date(),
			updatedAt: new Date()
		});

		// Save the project
		const savedProject = await project.save();
		console.log('Project saved successfully:', savedProject);
		return savedProject;
	} catch (error) {
		console.error('Error saving project:', error);
		throw error; // Re-throw to be caught by the action handler
	}
}
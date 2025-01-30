// src/routes/auth/callback/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { connectDB } from '$lib/server/db';
import { getProjectModel } from '$lib/server/models/project';
import { getUserModel } from '$lib/server/models/user';
import mongoose from 'mongoose';

export const load: PageServerLoad = async ({ locals, url }) => {
    const session = await locals.auth();

    if (!session?.user) {
        throw redirect(303, '/');
    }

    // Check for saved form data
    const savedFormData = await locals.formSession.get();
    if (savedFormData) {
        try {
            // Save the project
            await saveProject(savedFormData, session.user);
            // Clear the saved form data
            await locals.formSession.clear();
            throw redirect(303, '/project/success');
        } catch (error) {
            console.error('Failed to save project:', error);
            throw redirect(303, '/project/error');
        }
    }

    // Check for 'ref' query parameter to determine the redirect URL
    const ref = url.searchParams.get('ref');
    const redirectUrl = ref === 'start-project' ? '/start-project?ref=signin' : '/';

    // If no saved form data, redirect to the determined URL
    throw redirect(303, redirectUrl);
};

async function saveProject(formData: any, user: any) {
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
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { connectDB } from '$lib/server/db';
import { getProjectModel } from '$lib/server/models/project';
import { getUserModel } from '$lib/server/models/user';
import mongoose from 'mongoose';

// This is just to handle any direct access to /auth/callback
// The actual OAuth callback will be handled by Auth.js
export const load: PageServerLoad = async ({ locals, url, cookies }) => {
    console.log('[Callback] Starting callback handler');
    console.log('[Callback] URL:', url.toString());
    
    const session = await locals.auth();
    console.log('[Callback] Session:', session ? 'exists' : 'null');

    if (!session?.user) {
        console.log('[Callback] No session, redirecting to home');
        throw redirect(303, '/');
    }

    // Get redirectTo from our param
    const redirectTo = url.searchParams.get('redirectTo');
    console.log('[Callback] redirectTo:', redirectTo);

    if (redirectTo === 'project-save') {
        console.log('[Callback] Project save flow detected');
        try {
            // Get the saved form data from cookies
            const cookieHeader = cookies.get('tempFormData');
            console.log('[Callback] Found cookie data:', cookieHeader ? 'yes' : 'no');
            
            if (cookieHeader) {
                // Parse the saved data
                const formData = JSON.parse(cookieHeader);
                console.log('[Callback] Parsed form data:', formData);
                
                // Save the project
                const project = await saveProject(formData, session.user);
                console.log('[Callback] Project saved:', project._id);
                
                // Clear the saved form data
                cookies.delete('tempFormData', { path: '/' });
                console.log('[Callback] Cleared cookie data');
                
                // Redirect to success page
                console.log('[Callback] Redirecting to success page');
                throw redirect(303, '/project/success');
            }
        } catch (error) {
            console.error('[Callback] Error during project save:', error);
            throw redirect(303, '/project/error');
        }
    }

    // Default redirect
    console.log('[Callback] No special handling, redirecting to profile');
    throw redirect(303, '/profile');
};

async function saveProject(formData: any, user: any) {
    console.log('[SaveProject] Starting project save');
    console.log('[SaveProject] Form data:', formData);
    console.log('[SaveProject] User:', user);
    
    await connectDB();
    const Project = getProjectModel();
    const User = getUserModel();

    console.log('[SaveProject] Finding user in database');
    // Find the user by ID or email
    const userData = await User.findOne({
        $or: [
            { _id: new mongoose.Types.ObjectId(user.id) },
            { email: user.email }
        ]
    }).lean();

    if (!userData) {
        console.error('[SaveProject] User not found in database');
        throw new Error('User not found');
    }

    console.log('[SaveProject] Creating project document');
    // Create a new project using the form data and user ID
    const project = new Project({
        ...formData,
        contractor: userData._id,
        client: userData._id,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
    });

    // Save the project
    console.log('[SaveProject] Saving project to database');
    await project.save();
    console.log('[SaveProject] Project saved successfully');
    return project;
}
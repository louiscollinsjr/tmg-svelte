

// src/routes/auth/callback/+page.server.ts
export const load = async ({ locals, url }) => {
    const session = locals.session;
    
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

    // If no saved form data, redirect to home
    throw redirect(303, '/');
};
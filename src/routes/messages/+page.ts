import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
    // Get the layout data which includes user information
    const { userData, session } = await parent();
    
    if (!session?.user?.email) {
        console.log('No session or email, redirecting to login');
        throw redirect(302, '/login');
    }
    
    try {
        console.log('Loading conversations for user:', session.user.email);
        const response = await fetch('/api/conversations');
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response from server:', {
                status: response.status,
                error: errorData
            });
            
            if (response.status === 401) {
                throw redirect(302, '/login');
            }
            
            throw error(response.status, errorData.error || 'Failed to load conversations');
        }
        
        const conversations = await response.json();
        console.log('Successfully loaded conversations:', {
            count: conversations.length,
            ids: conversations.map((c: any) => c._id)
        });
        
        return {
            conversations,
            userData
        };
    } catch (e) {
        if (e.status === 302) throw e;
        
        console.error('Error loading conversations:', {
            error: e instanceof Error ? {
                name: e.name,
                message: e.message,
                stack: e.stack
            } : e
        });
        
        throw error(500, e instanceof Error ? e.message : 'Failed to load conversations');
    }
};

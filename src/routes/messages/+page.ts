import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent, url }) => {
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

        // Get conversation ID from URL if present
        const conversationId = url.searchParams.get('id');
        let selectedConversation = null;

        if (conversationId) {
            // Load specific conversation if ID is provided
            const convResponse = await fetch(`/api/conversations/${conversationId}`);
            if (convResponse.ok) {
                selectedConversation = await convResponse.json();
            }
        } else if (conversations.length > 0) {
            // Load most recent conversation by default
            const mostRecent = conversations[0]; // Assuming conversations are sorted by date
            const convResponse = await fetch(`/api/conversations/${mostRecent._id}`);
            if (convResponse.ok) {
                selectedConversation = await convResponse.json();
            }
        }
        
        return {
            conversations,
            userData,
            selectedConversation
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

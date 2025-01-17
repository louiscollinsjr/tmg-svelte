   <!-- src/routes/+layout.svelte -->
<script lang="ts">
    import { i18n } from '$lib/i18n';
    import { ParaglideJS } from '@inlang/paraglide-sveltekit';
    import '../app.css';
    import NavBar from './NavBar.svelte';
    import { signIn, signOut } from '@auth/sveltekit/client';
    import { page } from '$app/stores';

    let { children } = $props();
    const session = $derived($page.data.session);

    async function handleSignOut(event: MouseEvent) {
        event.preventDefault();
        try {
            await signOut({ callbackUrl: '/' });
        } catch (error) {
            console.error('[Client] Sign-out error:', error);
            window.location.href = '/';
        }
    }

    async function handleCreateProject() {
        if (!session?.user) {
            await signIn('google', { callbackUrl: '/projects/create' });
        }
    }
</script>

<ParaglideJS {i18n}>
    <nav class="navbar">
        <div class="nav-brand">
            <a href="/">Home</a>
        </div>
        <div class="nav-links">
            <a href="/projects/create" on:click={handleCreateProject} class="create-project-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Create Project
            </a>
            {#if session?.user}
                <a href="/profile">Profile</a>
                <a href="#" on:click={handleSignOut}>Logout</a>
            {:else}
                <a href="#" on:click={() => signIn('google')}>Login</a>
            {/if}
        </div>
    </nav>
    <main>
        {@render children()}
    </main>
</ParaglideJS>

<style>
    .navbar {
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .nav-brand {
        font-size: 1.25rem;
        font-weight: 600;
    }

    .nav-links {
        display: flex;
        gap: 1.5rem;
        align-items: center;
    }

    a {
        color: #4a5568;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;
    }

    a:hover {
        color: #2d3748;
    }

    .create-project-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #4f46e5;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        transition: background-color 0.2s;
    }

    .create-project-btn:hover {
        background: #4338ca;
        color: white;
    }

    main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }
</style>
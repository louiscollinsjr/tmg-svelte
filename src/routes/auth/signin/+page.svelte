<!-- src/routes/auth/signin/+page.svelte -->
<script lang="ts">
    import { signIn } from '@auth/sveltekit/client';
    import { page } from '$app/stores';

    async function handleSignIn() {
        await signIn('google', { 
            redirectTo: $page.url.searchParams.get('redirectTo') ?? '/profile'
        });
    }
</script>

<div class="signin-container">
    <h1>Sign In</h1>
    <div class="providers">
        <button 
            on:click={handleSignIn}
            class="provider-button google"
        >
            Sign in with Google
        </button>
    </div>
</div>

<style>
    .signin-container {
        max-width: 400px;
        margin: 2rem auto;
        padding: 2rem;
        text-align: center;
    }

    .providers {
        margin-top: 2rem;
    }

    .provider-button {
        display: inline-block;
        padding: 0.8rem 1.5rem;
        border-radius: 4px;
        text-decoration: none;
        font-weight: 500;
        transition: background-color 0.2s;
        border: none;
        cursor: pointer;
    }

    .google {
        background-color: #4285f4;
        color: white;
    }

    .google:hover {
        background-color: #3367d6;
    }
</style>
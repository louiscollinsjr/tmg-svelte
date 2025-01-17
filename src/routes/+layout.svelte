<script lang="ts">
    import { i18n } from '$lib/i18n';
    import { ParaglideJS } from '@inlang/paraglide-sveltekit';
    import { invalidateAll } from '$app/navigation';
    import '../app.css';
    import NavBar from './NavBar.svelte';
    import { get } from 'svelte/store';
	import { auth } from '$lib/stores';
    let { children } = $props();


    async function handleSignOut() {
        await invalidateAll()
        window.location.href = '/logout';
    }

    const session = get(auth);
</script>

<ParaglideJS {i18n}>
    <nav>
      	{#if session?.user}
			<a href="/">Home</a>
        	<a href="/profile">Profile</a>
			<button onclick={handleSignOut}>Logout</button>
		{:else}
			<a href="/">Home</a>
			<a href="/auth/signin">Login</a>
		{/if}
    </nav>
	{@render children()}
</ParaglideJS>
// src/routes/profile/+page.svelte
<script lang="ts">
    import { requireAuth } from '$lib/auth';
	import { onMount } from 'svelte';
    import { invalidateAll } from '$app/navigation';
    let session;

    onMount(async () => {
        session = await requireAuth({redirect: true, pathToRedirect: '/auth/signin'})
        if (session) {
                await invalidateAll()
        }
        
    });
</script>


{#if session}
<h1>Profile Page</h1>

<p>Welcome, {session.user?.email}</p>
{:else}
	<p>Loading...</p>
{/if}
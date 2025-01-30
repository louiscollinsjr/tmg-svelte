<!-- src/routes/project/success/+page.svelte -->
<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    onMount(() => {
        // Redirect to the profile page after a short delay
        const timeout = setTimeout(() => {
            goto('/profile');
        }, 8000); // 3 seconds

        return () => clearTimeout(timeout);
    });
</script>

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold text-green-600">Project Saved Successfully!</h1>
    <p>Your project has been saved. You will be redirected to your profile shortly.</p>
</div>
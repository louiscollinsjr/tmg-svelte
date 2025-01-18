   <!-- src/routes/+layout.svelte -->
<script lang="ts">
    import { i18n } from '$lib/i18n';
    import { ParaglideJS } from '@inlang/paraglide-sveltekit';
    import '../app.css';
    import NavBar from './NavBar.svelte';
	import Footer from './Footer.svelte';
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
   <NavBar />
    <main class="min-h-screen max-w-screen mx-auto bg-zinc-50">
        {@render children()}
    </main>
	<Footer />
</ParaglideJS>

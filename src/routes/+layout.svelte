   <!-- src/routes/+layout.svelte -->
<script lang="ts">
    import { i18n } from '$lib/i18n';
    import { ParaglideJS } from '@inlang/paraglide-sveltekit';
    import '../app.css';
    import NavBar from './NavBar.svelte';
	import Footer from './Footer.svelte';
    import { signIn, signOut } from '@auth/sveltekit/client';
    import { page } from '$app/state';
	import type { LayoutProps } from './$types';

    let { data, children }:LayoutProps = $props();

    const session = $derived(data.session);
    const userData = $derived(data.userData);

    console.log('Layoutx Session:', session);
    console.log('Layoutx UserData:', userData);

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
    {#if page.url.pathname !== '/auth/signup' && page.url.pathname !== '/login'}
        <NavBar userData={userData} />
    {/if}
    <main class="min-h-screen max-w-screen mx-auto bg-zinc-50">
        {@render children()}
    </main>
	{#if page.url.pathname !== '/auth/signup' && page.url.pathname !== '/login'}
        <Footer />
    {/if}
</ParaglideJS>

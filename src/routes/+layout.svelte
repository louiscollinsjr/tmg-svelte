<script lang="ts">
    import { i18n } from '$lib/i18n';
    import { ParaglideJS } from '@inlang/paraglide-sveltekit';
    import '../app.css';
    import NavBar from './NavBar.svelte';
    import Footer from './Footer.svelte';
    import { signIn, signOut } from '@auth/sveltekit/client';
    import { page } from '$app/stores';
    import type { LayoutData } from './$types';

    export let data: LayoutData;

    $: session = data.session;
    $: userData = data.userData;

    console.log('Layout Session:', session);
    console.log('Layout UserData:', userData);

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
    {#if $page.url.pathname !== '/auth/signup' && 
        $page.url.pathname !== '/login' && 
        !$page.url.pathname.startsWith('/messages')}
        <NavBar {session} {userData} />
    {/if}
    <main class="min-h-screen max-w-screen mx-auto bg-zinc-50">
        <slot />
    </main>
    {#if $page.url.pathname !== '/auth/signup' && 
        $page.url.pathname !== '/login' && 
        !$page.url.pathname.startsWith('/messages')}
        <Footer />
    {/if}
</ParaglideJS>
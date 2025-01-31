<!-- src/routes/NavBar.svelte -->
<script lang="ts">
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import { auth } from '$lib/stores';
    import { get } from 'svelte/store';
    import CaretDown from "phosphor-svelte/lib/CaretDown";
    import type { Session } from '@auth/core/types';
    import { signIn, signOut } from '@auth/sveltekit/client';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { goto } from '$app/navigation';

    let isProfileMenuOpen = false;
    let isProjectMenuOpen = false;
    let menuContainer: HTMLElement;
    let menuTimeout: NodeJS.Timeout;
    let previousAuthState = false;

    $: session = $page.data.session;

    // Log only when auth state changes
    $: {
        const currentAuthState = !!session;
        if (import.meta.env.DEV && currentAuthState !== previousAuthState) {
            console.log('[NavBar] Auth State Change:', {
                isAuthenticated: currentAuthState,
                user: session?.user?.name,
                action: currentAuthState ? 'SIGN_IN' : 'SIGN_OUT'
            });
            previousAuthState = currentAuthState;
        }
    }

    async function handleSignOut() {
        try {
            isProfileMenuOpen = false;
            isProjectMenuOpen = false;

            // Clear all auth-related cookies first
            document.cookie.split(';').forEach(cookie => {
                const [name] = cookie.split('=').map(c => c.trim());
                if (name.startsWith('next-auth') || 
                    name.includes('auth') || 
                    name.includes('session') || 
                    name.includes('oauth') ||
                    name.includes('google')) {
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/auth`;
                }
            });
            
            // Clear localStorage and sessionStorage
            ['auth', 'session', 'token', 'oauth', 'google'].forEach(key => {
                localStorage.removeItem(key);
                localStorage.removeItem(`${key}.state`);
                sessionStorage.removeItem(key);
                sessionStorage.removeItem(`${key}.state`);
            });

            // Clear auth store
            auth.set(null);

            // Sign out from the app
            await signOut({ 
                callbackUrl: '/'
            });

            // Clear Google's OAuth cache
            const googleLogoutUrl = 'https://accounts.google.com/logout';
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = googleLogoutUrl;
            document.body.appendChild(iframe);

            // Remove the iframe and perform final cleanup
            setTimeout(() => {
                iframe.remove();
                window.location.replace('/');
            }, 1000);
        } catch (error) {
            console.error('[NavBar] Sign-out error:', error);
            window.location.replace('/');
        }
    }

    async function handleSignIn(e: Event) {
        e.preventDefault();
        try {
            // Clear any existing auth state before signing in
            document.cookie.split(';').forEach(cookie => {
                const [name] = cookie.split('=').map(c => c.trim());
                if (name.startsWith('next-auth') || name.includes('auth')) {
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
                }
            });

            // Clear auth store
            auth.set(null);

            await signIn('google', { 
                callbackUrl: window.location.pathname,
                prompt: 'select_account'
            });
        } catch (error) {
            console.error('[NavBar] Sign-in error:', error);
        }
    }

    function handleLinkClick() {
        isProfileMenuOpen = false;
        isProjectMenuOpen = false;
    }

    function toggleProjectMenu(event: MouseEvent) {
        event.stopPropagation();
        isProjectMenuOpen = !isProjectMenuOpen;
        isProfileMenuOpen = false;
    }

    function toggleProfileMenu(event: MouseEvent) {
        event.stopPropagation();
        isProfileMenuOpen = !isProfileMenuOpen;
        isProjectMenuOpen = false;
    }

    function handleMouseEnter(menu: 'profile' | 'project') {
        if (menuTimeout) {
            clearTimeout(menuTimeout);
        }
    }

    function handleMouseLeave(menu: 'profile' | 'project') {
        menuTimeout = setTimeout(() => {
            if (menu === 'profile') {
                isProfileMenuOpen = false;
            } else {
                isProjectMenuOpen = false;
            }
        }, 200);
    }

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as Node;
        if (!(target as HTMLElement).closest('[data-menu-toggle]')) {
            isProfileMenuOpen = false;
            isProjectMenuOpen = false;
        }
    }

    onMount(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
            if (menuTimeout) {
                clearTimeout(menuTimeout);
            }
        };
    });
</script>

<nav class="fixed top-0 w-full z-50 pb-8 px-0">
    <div class={`backdrop-blur-sm bg-zinc-100/30 py-8 relative z-[60] ${isProjectMenuOpen || isProfileMenuOpen ? 'bg-zinc-100' : ''}`}>
        <div class="max-w-5xl mx-auto px-4 sm:px-[22px]">
            <div class="flex items-center h-[96px]">
                <div class="flex-shrink-0">
                    <a href="/" class="relative z-[100] block">
                        <img
                            src="/images/tmg_flags.png"
                            alt="TryMyGuys"
                            width={150}
                            height={96}
                            class="w-auto h-24 select-none"
                            style="image-rendering: auto; shape-rendering: auto"
                            priority
                        />
                    </a>
                </div>
                <div class="hidden md:flex flex-grow justify-center">
                    <div class="flex items-center space-x-10">
                        <a href="/explore-designs" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                            Explore Designs
                        </a>
                        
                        <div class="relative">
                            <button 
                                data-menu-toggle="project"
                                on:click={toggleProjectMenu}
                                class="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors focus:outline-none"
                            >
                                <span>Hire a tradesperson</span>
                                <CaretDown size={16} />
                            </button>

                            {#if isProjectMenuOpen}
                                <div 
                                    class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                                    on:mouseenter={() => handleMouseEnter('project')}
                                    on:mouseleave={() => handleMouseLeave('project')}
                                    role="menu"
                                >
                                    <div class="py-1" role="menuitem">
                                        <a
                                            href="/start-project"
                                            class="block px-4 py-2 text-sm text-gray-700 hover:text-[#ff6923]"
                                            role="menuitem"
                                            on:click={handleLinkClick}
                                        >
                                            Start a project
                                        </a>
                                    </div>
                                </div>
                            {/if}
                        </div>

                        <a href="/find-work" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                            Find Jobs
                        </a>
                        <a href="/help-center" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                            Help Center
                        </a>
                        <div class="ml-auto text-sm text-gray-600 hover:text-gray-900 transition-colors">
                            {#if session && session.user}
                                <div class="relative">
                                    <button 
                                        type="button"
                                        class="flex items-center space-x-2 focus:outline-none"
                                        data-menu-toggle="profile"
                                        on:click={toggleProfileMenu}
                                    >
                                        <img
                                            src={session.user.image ?? '/images/default-avatar.png'}
                                            alt={session.user.name ?? 'User avatar'}
                                            class="h-8 w-8 rounded-full"
                                        />
                                        <span class="text-sm font-medium text-gray-600">{session.user.name ?? 'User'}</span>
                                        <CaretDown size={16} class="text-gray-600" />
                                    </button>

                                    {#if isProfileMenuOpen}
                                        <div
                                            bind:this={menuContainer}
                                            class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                            role="menu"
                                            aria-orientation="vertical"
                                            aria-labelledby="user-menu-button"
                                            tabindex="-1"
                                            transition:fade={{ duration: 100 }}
                                            on:mouseenter={() => handleMouseEnter('profile')}
                                            on:mouseleave={() => handleMouseLeave('profile')}
                                        >
                                            <a
                                                href="/profile"
                                                 class="block px-4 py-2 text-sm text-gray-700 hover:text-[#ff6923]"
                                                role="menuitem"
                                                on:click={handleLinkClick}
                                            >
                                                Your Profile
                                            </a>
                                            <button
                                                on:click={handleSignOut}
                                                 class="block px-4 py-2 text-sm text-gray-700 hover:text-[#ff6923]"
                                                role="menuitem"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    {/if}
                                </div>
                            {:else}
                                <button
                                    on:click={handleSignIn}
                                    class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Sign in
                                </button>
                            {/if}
                        </div>
                    </div>
                </div>
                <div class="md:hidden ml-auto">
                    <button
                        on:click={toggleProjectMenu}
                        class="text-gray-600 hover:text-gray-900 transition-colors p-2 relative w-[20px] h-[20px]"
                        aria-label="Toggle menu"
                    >
                        <span class={`absolute left-2 block w-5 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${isProjectMenuOpen || isProfileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'}`}></span>
                        <span class={`absolute left-2 block w-5 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${isProjectMenuOpen || isProfileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                        <span class={`absolute left-2 block w-5 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${isProjectMenuOpen || isProfileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'}`}></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div 
        class={`md:hidden fixed inset-0 z-50 bg-zinc-100 px-8 transition-all duration-300 ease-in-out ${
            isProjectMenuOpen || isProfileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
    >
        <div class="flex flex-col items-start h-screen pt-20">
            <a
                href="/find-professionals"
                class="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
            >
                Find Professionals
            </a>
            <a
                href="/explore-designs"
                class="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
            >
                Explore Designs
            </a>
            <a
                href="/help"
                class="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
            >
                Help Center
            </a>
            <div class="w-full py-4 border-b border-gray-100">
                {#if session && session.user}
                    <div class="space-y-6">
                        <a
                            href="/profile"
                            class="block text-2xl text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Your Profile
                        </a>
                        <button
                            on:click={handleSignOut}
                            class="block text-2xl text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Sign out
                        </button>
                    </div>
                {:else}
                    <button
                        on:click={handleSignIn}
                        class="text-2xl text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Sign in
                    </button>
                {/if}
            </div>
        </div>
    </div>
</nav>
<script lang="ts">
    import CaretDown from "phosphor-svelte/lib/CaretDown";
    import InitialsAvatar from '$lib/components/InitialsAvatar.svelte';
    import type { Session } from '@auth/core/types';
    import { signIn, signOut } from '@auth/sveltekit/client';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';  // Import page for access to page.url

    //  Declare props using $props()
    interface Props {
        userData: {
            isPro: boolean;
            subscription: string;
            // Add other properties of userData here
        };
        session: Session | undefined | null;
    }
    
    let { userData, session } = $props<Props>();

    let isProfileMenuOpen = $state(false);
    let isProjectMenuOpen = $state(false);
    let menuContainer: HTMLElement;
    let menuTimeout: NodeJS.Timeout;
    let previousAuthState = false;

    // Log only when auth state changes
    $effect(() => {
        const currentAuthState = !!session;
        if (import.meta.env.DEV && currentAuthState !== previousAuthState) {
            previousAuthState = currentAuthState;
        }
    });

    async function handleSignOut() {
        try {
            isProfileMenuOpen = false;
            isProjectMenuOpen = false;

            // Clear all auth-related cookies first
            document.cookie.split(';').forEach(cookie => {
                const [name] = cookie.split('=').map(c => c.trim());
                if (name.startsWith('next-auth.session-token') ||
                    name.includes('auth.session')) {
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/auth`;
                }
            });

            // Clear localStorage and sessionStorage
            ['next-auth.session-token', 'auth.session'].forEach(key => {
                localStorage.removeItem(key);
                localStorage.removeItem(`${key}.state`);
                sessionStorage.removeItem(key);
                sessionStorage.removeItem(`${key}.state`);
            });

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
        console.log('Toggle Profile Menu Clicked');
        event.stopPropagation();
        isProfileMenuOpen = !isProfileMenuOpen;
        console.log('isProfileMenuOpen:', isProfileMenuOpen);
        isProjectMenuOpen = false;
    }

    function handleMouseEnter(event: MouseEvent) {
        if (menuTimeout) {
            clearTimeout(menuTimeout);
        }
    }

    function handleMouseLeave(event: MouseEvent) {
        menuTimeout = setTimeout(() => {
            isProfileMenuOpen = false;
            isProjectMenuOpen = false;
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
                        <a href="/explore-designs" class="text-sm text-gray-600 hover:text-[#ff6923] transition-colors">
                            Explore Designs
                        </a>

                        <div class="relative">

                            <a href="/start-project" class="text-sm text-gray-600 hover:text-[#ff6923] transition-colors">
                                Start a project
                            </a>

                        </div>

                        <a href="/find-work" class="text-sm text-gray-600 hover:text-[#ff6923] transition-colors">
                            Find Jobs
                        </a>
                        <a href="/help-center" class="text-sm text-gray-600 hover:text-[#ff6923] transition-colors">
                            Help Center
                        </a>
                        {#if userData && userData.isPro && userData.subscription !== 'Elite Contractor'}
                        <a
                            href="/pricing"
                            class="inline-flex items-center px-4 py-2 mr-4 text-sm font-medium text-black bg-[#ff4500]/10 hover:bg-opacity-90 rounded-md transition-colors"
                        >
                            Go Pro+
                        </a>
                    {/if}
                        <div class=" ml-auto text-sm text-gray-600 hover:text-[#ff6923] transition-colors">
                            {#if session && session.user}
                                <div class="relative inline-block">
                                    <button
                                        type="button"
                                        class="flex items-center space-x-2 focus:outline-none"
                                        data-menu-toggle="profile"
                                        onclick={toggleProfileMenu}
                                    >
                                        {#if session.user.image}
                                            <img
                                                src={session.user.image}
                                                alt={session.user.name ?? 'User avatar'}
                                                class="h-12 w-12 rounded-full"
                                            />
                                        {:else}
                                            <InitialsAvatar name={session.user.name} size="sm" />
                                        {/if}
                                        <!-- <span class="text-sm font-medium text-gray-600 hover:text-[#ff6923]">{session.user.name ?? 'User'}</span> -->
                                        <!-- <CaretDown size={16} class="text-gray-600 hover:text-[#ff6923]" /> -->
                                        <span class="absolute bottom-1 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>
                                    </button>

                                    {#if isProfileMenuOpen}
                                        <div tabindex="-1" role="menu" transition:fade class="absolute right-0 mt-2 w-48 rounded-lg shadow-2xl z-10 bg-white ring-1 ring-black ring-opacity-5 z-[1000]"
                                            onmouseenter={handleMouseEnter}
                                            onmouseleave={handleMouseLeave}
                                        >
                                            <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                <a href="/messages" class="block px-4 py-4 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onclick={handleLinkClick}>
                                                    Messages
                                                 </a>
                                                 <a href="/projects" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onclick={handleLinkClick}>
                                                    Projects
                                                 </a>
                                                 <a href="/favorites" class="block px-4 py-4 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onclick={handleLinkClick}>
                                                    Favorites
                                                 </a>
                                                 <a href="/account" class="border-t block px-4 py-5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onclick={handleLinkClick}>
                                                    Account
                                                 </a>
                                                 <a href="/profile" class="block px-4 py-2 pb-5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onclick={handleLinkClick}>
                                                    Profile
                                                </a>
                                                <a href="/help-center" class="border-t block px-4 py-5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onclick={handleLinkClick}>
                                                   Help Center
                                                 </a>
                                               
                                                <button type="button" class="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onclick={handleSignOut} >
                                                    Sign off
                                                </button>
                                            </div>
                                        </div>
                                    {/if}
                                </div>
                            {:else}
                                <button
                                    onclick={() => goto('/login')}
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
                        onclick={toggleProjectMenu}
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
                            onclick={handleSignOut}
                            class="block text-2xl text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Sign out
                        </button>
                    </div>
                {:else}
                    <button
                        onclick={() => goto('/login')}
                        class="text-2xl text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Sign in
                    </button>
                {/if}
            </div>
        </div>
    </div>
</nav>
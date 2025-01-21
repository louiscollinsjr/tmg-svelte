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
      
    let isMenuOpen = false;
    let isProfileOpen = false;
    let session: Session | null = null;
    let menuContainer: HTMLElement;

    auth.subscribe(value => {
        session = value;
    });
      
    function handleLinkClick() {
        isMenuOpen = false;
        isProfileOpen = false;
    }
  
    async function handleSignOut() {
        await signOut();
        await invalidateAll();
        isProfileOpen = false;
        isMenuOpen = false;
    }

    async function handleSignIn(e: Event) {
        e.preventDefault();
        await signIn('google');
    }
  
    function toggleProfileMenu() {
        isProfileOpen = !isProfileOpen;
    }

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) isProfileOpen = false;
    }

    function handleClickOutside(event: MouseEvent) {
        if (menuContainer && !menuContainer.contains(event.target as Node)) {
            isMenuOpen = false;
        }
    }

    onMount(() => {
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    });
</script>

<nav class="fixed top-0 w-full z-50 pb-8 px-0">
    <div class={`backdrop-blur-sm bg-zinc-100/30 py-8 relative z-[60] ${isMenuOpen ? 'bg-zinc-100' : ''}`}>
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
                        
                        <div bind:this={menuContainer} class="relative inline-block text-left">
                            <button
                                on:click={toggleMenu}
                                class="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1"
                            >
                                Hire a Tradesperson
                                <CaretDown size={12} weight="bold" class="text-gray-400" />
                            </button>
                            {#if isMenuOpen}
                                <div class="absolute left-0 mt-2 w-48 origin-top-left rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
                                    <!-- <a
                                        href="/find-professionals"
                                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        Browse Tradespersons
                                    </a> -->
                                    <a
                                        href="/start-project"
                                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        Submit a Project
                                    </a>
                                    <!-- <a
                                        href="/hiring-guide"
                                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        Join TryMyGuys
                                    </a> -->
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
                            {#if session}
                                <div class="relative">
                                    <button 
                                        on:click={toggleProfileMenu}
                                        class="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        <span>{session.user.name || 'Profile'}</span>
                                        <CaretDown weight="bold" class="w-4 h-4" />
                                    </button>
                                    
                                    {#if isProfileOpen}
                                        <div class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                            <div class="py-1" role="menu">
                                                <a
                                                    href="/profile"
                                                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    role="menuitem"
                                                >
                                                    Your Profile
                                                </a>
                                                <button
                                                    on:click={handleSignOut}
                                                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    role="menuitem"
                                                >
                                                    Sign out
                                                </button>
                                            </div>
                                        </div>
                                    {/if}
                                </div>
                            {:else}
                                <form method="POST" action="/auth/signin">
                                    <button 
                                        type="submit" 
                                        on:click={handleSignIn}
                                        class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        Sign in
                                    </button>
                                </form>
                            {/if}
                        </div>
                    </div>
                </div>
                <div class="md:hidden ml-auto">
                    <button
                        on:click={toggleMenu}
                        class="text-gray-600 hover:text-gray-900 transition-colors p-2 relative w-[20px] h-[20px]"
                        aria-label="Toggle menu"
                    >
                        <span class={`absolute left-2 block w-5 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'}`}></span>
                        <span class={`absolute left-2 block w-5 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                        <span class={`absolute left-2 block w-5 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'}`}></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div 
        class={`md:hidden fixed inset-0 z-50 bg-zinc-100 px-8 transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
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
                {#if session}
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
                    <form method="POST" action="/auth/signin">
                        <button 
                            type="submit"
                            on:click={handleSignIn} 
                            class="text-2xl text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Sign in
                        </button>
                    </form>
                {/if}
            </div>
        </div>
    </div>
</nav>
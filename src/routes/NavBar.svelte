<!-- src/routes/NavBar.svelte -->
<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import { auth } from '$lib/stores';
    import { get } from 'svelte/store';
    import CaretDown from "phosphor-svelte/lib/CaretDown";
    import { signIn, signOut } from '@auth/sveltekit/client';
      
    let isMenuOpen = false;
    let isProfileOpen = false;
    let session;

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
    }
  
    function toggleProfileMenu() {
      isProfileOpen = !isProfileOpen;
    }
</script>

<nav class="fixed top-0 w-full z-50 px-4 pb-8 px-0">
    {#if session?.user}
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
                
                <div class="relative inline-block text-left">
                <button
                    onclick={() => isMenuOpen = !isMenuOpen}
                    class="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1"
                 >
                   Hire a Tradesperson
                    <CaretDown size={12} weight="bold" class="text-gray-400" />
                  </button>
                 {#if isMenuOpen}
                    <div class="absolute left-0 mt-2 w-48 origin-top-left rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
                          
                            <a
                                href="/find-professionals"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onclick={handleLinkClick}
                            >
                                Browse Tradespersons
                           </a>
                          
                           <a
                                href="/submit-project"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onclick={handleLinkClick}
                            >
                                Submit a Project
                            </a>
                          
                           <a
                                href="/hiring-guide"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onclick={handleLinkClick}
                            >
                                Hiring on TryMyGuys
                            </a>
                       </div>
                 {/if}
                </div>

                <a href="/help" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                   Find Jobs
                </a>
                <a href="/help" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Help Center
                </a>
                <div class="ml-auto text-sm text-gray-600 hover:text-gray-900 transition-colors">
                {#if session?.user}
                  <div class="relative">
                    <button 
                      onclick={toggleProfileMenu}
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
                            onclick={handleLinkClick}
                          >
                            Your Profile
                          </a>
                          <button
                            onclick={handleSignOut}
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
                  <form method="post" action="/api/auth/signin">
                    <button type="submit" onclick={(e) => {e.preventDefault(); signIn('google');}} class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      Sign in
                    </button>
                  </form>
                {/if}
                </div>
              </div>
            </div>
            <div class="md:hidden ml-auto">
               <button
                    onclick={() => isMenuOpen = !isMenuOpen}
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
                onclick={handleLinkClick}
                class="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
              >
                Find Professionals
             </a>
            <a
                href="/explore-designs"
                onclick={handleLinkClick}
                class="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
              >
                Explore Designs
             </a>
            <a
                href="/help"
                onclick={handleLinkClick}
                class="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
             >
                Help Center
             </a>
            <div class="w-full py-4 border-b border-gray-100">
              {#if session?.user}
                <div class="space-y-6">
                  <a
                    href="/profile"
                    class="block text-2xl text-gray-600 hover:text-gray-900 transition-colors"
                    onclick={handleLinkClick}
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
                <form method="post" action="/api/auth/signin">
                  <button type="submit" onclick={(e) => {e.preventDefault(); signIn('google');}} class="text-2xl text-gray-600 hover:text-gray-900 transition-colors">
                    Sign in
                  </button>
                </form>
              {/if}
            </div>
        </div>
      </div>
    {:else}
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
                
                <div class="relative inline-block text-left">
                <button
                    onclick={() => isMenuOpen = !isMenuOpen}
                    class="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1"
                 >
                   Hire a Tradesperson
                    <CaretDown size={12} weight="bold" class="text-gray-400" />
                  </button>
                 {#if isMenuOpen}
                    <div class="absolute left-0 mt-2 w-48 origin-top-left rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
                          
                            <a
                                href="/find-professionals"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onclick={handleLinkClick}
                            >
                                Browse Tradespersons
                           </a>
                          
                           <a
                                href="/submit-project"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onclick={handleLinkClick}
                            >
                                Submit a Project
                            </a>
                          
                           <a
                                href="/hiring-guide"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onclick={handleLinkClick}
                            >
                                Hiring on TryMyGuys
                            </a>
                       </div>
                 {/if}
                </div>

                <a href="/help" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                   Find Jobs
                </a>
                <a href="/help" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Help Center
                </a>
                <div class="ml-auto text-sm text-gray-600 hover:text-gray-900 transition-colors">
                {#if session?.user}
                  <div class="relative">
                    <button 
                      onclick={toggleProfileMenu}
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
                            onclick={handleLinkClick}
                          >
                            Your Profile
                          </a>
                          <button
                            onclick={handleSignOut}
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
                  <form method="post" action="/api/auth/signin">
                    <button type="submit" onclick={(e) => {e.preventDefault(); signIn('google');}} class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      Sign in
                    </button>
                  </form>
                {/if}
                </div>
              </div>
            </div>
            <div class="md:hidden ml-auto">
               <button
                    onclick={() => isMenuOpen = !isMenuOpen}
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
                onclick={handleLinkClick}
                class="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
              >
                Find Professionals
             </a>
            <a
                href="/explore-designs"
                onclick={handleLinkClick}
                class="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
              >
                Explore Designs
             </a>
            <a
                href="/help"
                onclick={handleLinkClick}
                class="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
             >
                Help Center
             </a>
            <div class="w-full py-4 border-b border-gray-100">
              {#if session?.user}
                <div class="space-y-6">
                  <a
                    href="/profile"
                    class="block text-2xl text-gray-600 hover:text-gray-900 transition-colors"
                    onclick={handleLinkClick}
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
                <form method="post" action="/api/auth/signin">
                  <button type="submit" onclick={(e) => {e.preventDefault(); signIn('google');}} class="text-2xl text-gray-600 hover:text-gray-900 transition-colors">
                    Sign in
                  </button>
                </form>
              {/if}
            </div>
        </div>
      </div>
    {/if}
</nav>
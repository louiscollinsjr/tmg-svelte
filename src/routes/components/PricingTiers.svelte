<!-- src/routes/components/PricingTiers.svelte -->
<script lang="ts">

     
  
    interface PricingFeature {
      name: string;
      included: boolean;
    }
    
    interface PricingTier {
      name: string;
      price: number;
      description: string;
      features: PricingFeature[];
      highlight?: boolean;
      cta: string;
      upgradeCta: string;
    }
    
      const pricingTiers: PricingTier[] = [
      {
          name: 'Starter Kit',
          price: 0,
          description: 'Essential tools to kickstart your business',
          features: [
          { name: 'Profile w/ 1 Service Type', included: true },
          { name: 'Brief Description', included: true },
          { name: 'Online Advertisement', included: true },
          // { name: 'Project Images', included: false },
          // { name: 'Website', included: false },
          // { name: 'Email Service', included: false },
          // { name: 'Booking Calendar', included: false },
          ],
          cta: 'Get Started',
          upgradeCta: 'Current',
      },
      {
          name: 'Pro Connect',
          price: 600,
          description: 'Get access high-quality projects',
          highlight: true,
          features: [
          { name: 'Personal or Business Profile (3 Service Types)', included: true },
          { name: 'Access to Listed Projects (Up to 3 Service Types)', included: true },
          { name: 'Standard Website', included: true },
          { name: 'Brief Description', included: true },
          { name: 'Online Advertisement', included: true },
          { name: '6 Project Images', included: true },
          // { name: 'Email Service', included: false },
          // { name: 'Booking Calendar', included: false },
          ],
          cta: 'Join Pro Connect Yearly',
          upgradeCta: 'Current',
      },
      {
          name: 'Master Craftsman',
          price: 900,
          description: 'Stand out with priority access to premium projects',
          features: [
          { name: 'Personal or Business Profile (6 Service Types)', included: true },
          { name: 'Access to Listed Projects (6 Service Types)', included: true },
          { name: 'Branded Website', included: true },
          { name: 'Brief Description', included: true },
          { name: 'Online Advertisement', included: true },
          { name: '12 Project Images', included: true },
          { name: 'Email Service', included: true },
          // { name: 'Booking Calendar', included: false },
          ],
          cta: 'Join Pro Connect Yearly',
          upgradeCta: 'Current',
      },
      {
          name: 'Elite Contractor',
          price: 1200,
          description: 'Unlock exclusive jobs and Top-Tier Projects',
          features: [
          { name: 'Personal or Business Profile (All Service Types)', included: true },
          { name: 'Access to All Listed Projects', included: true },
          { name: 'Custom Website', included: true },
          { name: 'Brief Description', included: true },
          { name: 'Online Advertisement', included: true },
          { name: '24 Project Images', included: true },
          { name: 'Email Service', included: true },
          { name: 'Booking Calendar', included: true },
          ],
          cta: 'Join Elite Contractor Yearly',
          upgradeCta: 'Join Elite Contractor Yearly',
      },
      ];
    let isModalOpen = false;
    let selectedTier: PricingTier | null = null;
    
    // Add these to track user status
    import { page } from '$app/stores';
    let isLoggedIn = false;
    let isPro = false;
    
    $: {
        // isLoggedIn = !!$page.data.session;
        // isPro = !!$page.data.session?.user?.isPro;
        // userSubscription = $page.data.session?.user?.subscription || '';
    }
    
  </script>
  
 
  <div class="">
      <div class="mx-auto max-w-screen-7xl px-2 pb-32">
        <div class="isolate mx-auto mt-16 grid w-full grid-cols-1 md:grid-cols-4 lg:gap-x-4 xl:gap-x-4">
          {#each pricingTiers as tier}
              <div
               class={`rounded-3xl px-6 py-8 ring-1 ring-gray-200 ${
                 tier.highlight
                   ? 'bg-white shadow-xl ring-2 ring-burnt-orange'
                   : 'bg-white/60'
               }`}
              >
              <h3 class="text-lg font-semibold leading-8 text-gray-900 h-10 flex items-center">
                 {tier.name}
              </h3>
            
              <p class="mt-3 flex items-baseline gap-x-1">
                <span class="text-3xl font-bold tracking-tight text-gray-900">
                    <span class="text-base mr-1">$</span>{tier.price}
                  </span>
                   <span class="text-sm leading-6 text-gray-600">
                     per year
                  </span>
              </p>
              <p class="mt-3 text-xs leading-4 text-gray-600 h-8 w-48">
                {tier.description}
              </p>

               <button
                   class={`text-sm mt-8 block w-full rounded-lg px-3 py-2 font-medium leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 font-roboto ${
                     tier.highlight
                        ? 'bg-[#ff4500] text-white hover:bg-opacity-90'
                         : 'bg-zinc-200 text-slate-800 hover:bg-zinc-300'
                    }`}
               >
                  {isLoggedIn && ((isPro && tier.price > 0) || (!isPro && tier.price === 0)) ? tier.upgradeCta : tier.cta}
                </button>
                <div class="w-full h-px bg-gray-200 my-6"></div>
              <ul class="space-y-1 text-xs leading-6 text-gray-600">
                  {#each tier.features as feature (feature.name)}
                      <li class="flex gap-x-3">
                          {#if feature.included}
                              <svg
                              class="h-6 w-3 flex-none text-green-500"
                             viewBox="0 0 20 20"
                              fill="currentColor"
                              >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                              </svg>
                          {:else}
                              <svg
                                 class="h-6 w-3 flex-none text-gray-400"
                              viewBox="0 0 20 20"
                                 fill="currentColor"
                                  >
                                  <path
                                    fillRule="evenodd"
                                       d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                                        clipRule="evenodd"
                                  />
                              </svg>
                           {/if}
                           {feature.name}
                      </li>
                 {/each}
              </ul>
             </div>
          {/each}
        </div>
      </div>
  </div>
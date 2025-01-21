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
    }
    
      const pricingTiers: PricingTier[] = [
      {
          name: 'Starter Kit',
          price: 0,
          description: 'Essential tools to kickstart your business',
          features: [
          { name: 'Personal or Business Profile (1 Service Type)', included: true },
          { name: 'Brief Description', included: true },
          { name: 'Online Advertisement', included: true },
          { name: 'Project Images', included: false },
          { name: 'Website', included: false },
          { name: 'Email Service', included: false },
          { name: 'Booking Calendar', included: false },
          ],
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
          { name: 'Email Service', included: false },
          { name: 'Booking Calendar', included: false },
          ],
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
          { name: 'Booking Calendar', included: false },
          ],
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
      },
      ];
    let isModalOpen = false;
    
  </script>
  
 
  <div class="~pt-24/80">
      <div class="mx-auto max-w-screen-7xl px-6 lg:px-8">
        <!-- <div class="mx-auto ~max-w-screen-4xl/7xl text-center">
          <h2 class="~text-5xl/7xl md:~text-6xl/9xl font-bold tracking-tight text-slate-800">
              Pricing
          </h2>
          <p class="~mt-6/16 ~text-lg/2xl leading-8 text-gray-600">
              Choose the perfect plan for your business needs
          </p>
        </div> -->
        <div class="isolate mx-auto mt-16 grid w-full grid-cols-1 gap-y-8 sm:max-w-xl md:max-w-3xl lg:mx-0 lg:max-w-none lg:grid-cols-4 lg:gap-x-4 xl:gap-x-4">
          {#each pricingTiers as tier}
              <div
               class={`rounded-3xl p-8 ring-1 ring-gray-200 ${
                 tier.highlight
                   ? 'bg-white shadow-xl ring-2 ring-burnt-orange'
                   : 'bg-white/60'
               }`}
              >
              <h3 class="~text-lg/4xl font-semibold leading-8 text-gray-900">
                 {tier.name}
              </h3>
              <p class="mt-4 ~text-sm/2xl leading-6 text-gray-600">
                 {tier.description}
               </p>
              <p class="mt-6 flex items-baseline gap-x-1">
                <span class="text-4xl font-bold tracking-tight text-gray-900">
                    ${tier.price}
                  </span>
                   <span class="~text-sm/4xl font-semibold leading-6 text-gray-600">
                     /year
                  </span>
              </p>
               <button
                  
                   class={` text-sm mt-6 block w-fit rounded-full px-3 py-2 ~text-base/2xl md:~text-2xl/3xl font-medium leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 font-roboto ${
                     tier.highlight
                        ? 'bg-[#ff4500] text-white hover:bg-opacity-90'
                         : 'bg-zinc-200 text-slate-800 hover:bg-zinc-300'
                    }`}
               >
                   Get started
                </button>
              <ul class="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {#each tier.features as feature (feature.name)}
                      <li class="flex gap-x-3">
                          {#if feature.included}
                              <svg
                              class="h-6 w-5 flex-none text-burnt-orange"
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
                                 class="h-6 w-5 flex-none text-gray-400"
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
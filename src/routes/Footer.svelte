<script lang="ts">
    /// <reference types="svelte" />
    import type { ComponentType } from 'svelte';
    // import { Icon } from "svelte-icons-pack/components";
    // import { SiInstagram, SiBluesky, SiX, SiLinkedin } from "svelte-icons-pack/si";

</script>

<footer class="bg-zinc-100 text-gray-800 pt-24 text-xs">
    <div class="max-w-5xl mx-auto px-4 sm:px-[22px]">
       
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 pb-12">
            
            <div class="lg:col-span-3">
                <h3 class="font-bold mb-4 text-3xl">tmg.</h3>
                <p class="text-gray-800 mb-4">
                    Connecting homeowners with trusted professionals.
                </p>
                <!-- <div class="flex space-x-4">
                    <a
                        href="https://instagram.com/trymyguys"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-gray-800/80 hover:text-blue-500 transition-colors"
                    >
                        <Icon src={SiInstagram} className="w-4 h-4" />
                    </a>
                     <a
                        href="https://bsky.app/profile/trymyguys.bsky.social"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-gray-800/80 hover:text-blue-500 transition-colors"
                    >
                         <Icon src={SiBluesky} className="w-4 h-4" />
                    </a>
                   
                    
                </div> -->
            </div>

           
            <div class="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:justify-items-center">
                <div class="space-y-8">
                    <div>
                        <h3 class="font-semibold mb-4">For Homeowners</h3>
                        <ul class="space-y-2">
                            <li>
                                <a
                                    href="#"
                                    class="text-gray-700/80 hover:text-white hover:underline transition-colors"
                                >
                                    Our Services
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    class="text-gray-700/80 hover:text-white hover:underline transition-colors"
                                >
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    class="text-gray-700/80 hover:text-white hover:underline transition-colors"
                                >
                                    Reviews
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-4">Support</h3>
                        <ul class="space-y-2">
                            <li>
                                <a
                                    href="#"
                                    class="text-gray-700/80 hover:text-white hover:underline transition-colors"
                                >
                                    Help Center
                                </a>
                            </li>
                            <li>
                                 <a
                                    href="#"
                                    class="text-gray-700/80 hover:text-white hover:underline transition-colors"
                                >
                                   Safety Center
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

               
                <div class="space-y-8">
                    <div>
                        <h3 class="font-semibold mb-4">For Professionals</h3>
                        <ul class="space-y-2">
                            <li>
                                <a
                                    href="#"
                                    class="text-gray-700/80 hover:text-white hover:underline transition-colors"
                                >
                                    Join Our Network
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    class="text-gray-700/80 hover:text-white hover:underline transition-colors"
                                >
                                    Resources
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    class="text-gray-700/80 hover:text-white hover:underline transition-colors"
                                >
                                    Pro Tools
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-4">Contact</h3>
                        <ul class="space-y-2">
                            <li>
                                <a
                                    href="/contact"
                                    class="text-gray-700/80 hover:text-white hover:underline transition-colors"
                                >
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:support@trymyguys.com"
                                    class="text-gray-700/80 hover:text-white hover:underline transition-colors"
                                >
                                    support@trymyguys.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

             
                <div>
                    <h3 class="font-semibold mb-4">Explore Designs</h3>
                    <ul class="space-y-2">
                        <li>
                            <a
                                href="#"
                                class="text-gray-700/80 hover:text-white hover:underline transition-colors"
                            >
                                Kitchen & Dining
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                class="text-gray-700/80 hover:text-white hover:underline transition-colors"
                            >
                                Living Rooms
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                class="text-gray-700/80 hover:text-white hover:underline transition-colors"
                            >
                                Bed & Bath
                            </a>
                        </li>
                        <li>
                             <a
                                href="#"
                                class="text-gray-700/80 hover:text-white hover:underline transition-colors"
                             >
                                 Outdoor Spaces
                             </a>
                         </li>
                        <li>
                             <a
                                href="#"
                                class="text-gray-700/80 hover:text-white hover:underline transition-colors"
                             >
                                 Bar & Wine
                            </a>
                         </li>
                    </ul>
                </div>
            </div>
        </div>

       
        <div class="border-t border-gray-700/20 py-6">
            <div class="flex flex-col md:flex-row justify-between items-center text-gray-700/80">
                <div class="mb-4 md:mb-0">
                    {new Date().getFullYear()} tmg. All rights reserved.
                </div>

                <div class="flex flex-wrap justify-center gap-x-4 mb-4 md:mb-0">
                    <a href="/privacy" class="hover:text-gray-800 hover:underline">Privacy Policy</a>
                    <span class="hidden md:inline">|</span>
                    <a href="/terms" class="hover:text-gray-800 hover:underline">Terms of Use</a>
                    <span class="hidden md:inline">|</span>
                     <a href="/legal" class="hover:text-gray-800 hover:underline">Legal</a>
                </div>

                <div>United States</div>
            </div>
        </div>
    </div>
</footer>
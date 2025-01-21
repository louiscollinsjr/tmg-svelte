<!-- src/routes/help/+page.svelte -->
<script lang="ts">
	
  import { CaretDown, CaretUp } from "phosphor-svelte";


  interface FAQItem {
    question: string;
    answer: string;
  }
  
    const faqItems: FAQItem[] = [
    {
        question: "How does TryMyGuys verify service professionals?",
        answer: "We use a comprehensive verification process that includes background checks, license verification, and community reviews to ensure all professionals meet our quality standards."
    },
    {
        question: "What happens after I submit a service request?",
        answer: "Once you submit a request, we'll match you with relevant professionals in your area. You'll receive notifications when pros express interest, and you can review their profiles and ratings before making a decision."
    },
    {
        question: "Are the service professionals insured?",
        answer: "Yes, all service professionals on our platform are required to maintain appropriate insurance coverage for their specific trade or service category."
    },
    {
        question: "How do I leave a review for a service?",
        answer: "After your service is completed, you'll receive a notification to rate and review your experience. Your honest feedback helps maintain quality and assists other community members in making informed decisions."
    },
    {
        question: "What if I'm not satisfied with the service?",
        answer: "Your satisfaction is our priority. If you're not happy with a service, contact our support team within 48 hours, and we'll work with you and the service provider to resolve any issues."
    }
    ];
    
    let openIndex: number | null = null;

	const toggleAccordion = (index: number) => {
		openIndex = openIndex === index ? null : index;
	};
</script>

<div class="min-h-screen bg-gray-50 pt-64">
    <section class="mx-auto px-4 sm:px-[22px] py-16 font-roboto">
      <div class="max-w-5xl mx-auto px-4 sm:px-[22px]">
        <div class="grid md:grid-cols-2 gap-20 items-start">
          <!-- {/* Left Column */} -->
          <div class="text-center mx-auto">
            <h1
                class="mb-6 font-sourceserif text-3xl font-[400] tracking-wide text-gray-900 md:text-6xl md:leading-[1.2]"
            >
                Your questions, <span
                    class="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"
                    >answered.</span
                >
            </h1>
            <p class="mx-auto mb-8 max-w-sm font-sans text-lg font-normal tracking-normal text-gray-900">
                We&apos;re here to help both homeowners and tradespeople navigate our platform with ease. Find answers and get started confidently.
            </p>
        </div>

          <!-- {/* Right Column - FAQ */} -->
          <div>
            <div class="space-y-4 tracking-wide font-roboto">
              {#each faqItems as item, index}
                <div class:border-b={index !== faqItems.length - 1} class="border-gray-200">
                    <button
                    on:click={() => toggleAccordion(index)}
                    class="flex justify-between items-center w-full py-4 text-left"
                    >
                    <span class="text-lg font-medium text-black">{item.question}</span>
                    <span class="ml-6 flex-shrink-0">
                        {#if openIndex === index}
                            <CaretUp size={20} class="text-gray-500"/>
                        {:else}
                           <CaretDown size={20} class="text-gray-500"/>
                         {/if}
                    </span>
                    </button>
                  {#if openIndex === index}
                      <div class="pb-4">
                      <p class="text-sm font-light text-gray-800 font-roboto">{item.answer}</p>
                    </div>
                 {/if}
                </div>
            {/each}
            </div>
         </div>
       </div>
      </div>
   </section>
</div>
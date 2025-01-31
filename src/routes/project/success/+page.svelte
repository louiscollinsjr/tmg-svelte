<!-- src/routes/project/success/+page.svelte -->
<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    onMount(() => {
        // Redirect to the profile page after a short delay
        const timeout = setTimeout(() => {
            goto('/profile');
        }, 3000); // 3 seconds

        return () => clearTimeout(timeout);
    });
</script>


  
  <div class="min-h-screen flex items-center justify-center p-4 bg-gray-50">
    <div class="bg-[#f8f7f3] rounded-2xl max-w-xl w-full p-16 relative overflow-hidden shadow-lg">
      <div class="absolute inset-0">
        <div
          class="absolute inset-0"
          style="
            background-image: radial-gradient(
              circle at center,
              var(--tw-gradient-from) 0.5rem,
              transparent 0.5rem
            ),
            radial-gradient(
              circle at center,
              var(--tw-gradient-from) 0.25rem,
              transparent 0.25rem
            );
            background-size: 4rem 4rem, 2rem 2rem;
            background-position: 0 0, 1rem 1rem;
            background-repeat: repeat;
            --tw-gradient-from: rgb(255 137 53 / 0.1);
          "
        />
        <div class="absolute inset-0 bg-gradient-to-b from-[#f8f7f3] via-[#f8f7f3]-100/5 to-transparent" />
      </div>
      <div class="relative text-center">
        <div class="mb-12 flex justify-center">
          <div class="bg-orange-500 rounded-full p-4">
            <svg class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 class="text-4xl font-semibold mb-6 tracking-tight">
          Project created successfully.
        </h2>
        <p class="text-gray-600 mb-12 text-sm font-semibold">
          Thank you. We are adding to your dash board now.
        </p>
        <div class="flex justify-center">
          <div class="flex -space-x-2">
            {#each [1, 2, 3, 4, 5] as i}
              <div
                key={i}
                class="w-12 h-12 rounded-full border-4 border-white bg-cover bg-center bg-no-repeat"
                style={`background-image: url("/images/avatars/avatar0${i}.png");`}
              ></div>
            {/each}
          </div>
        </div>
        <p class="text-[10px] font-bold text-gray-600 mt-2">
          You're not alone, <span class="text-orange-600 font-semibold">the world</span> is creating projects!
        </p>
      </div>
    </div>
  </div>
<script>
    import { onMount } from 'svelte';
  
    export let opacity = "0.03";
    export let patternClassName = ""; 
  
    const backgroundIcons = [
      'broom', 'bug', 'couch', 'fan', 'lightning',
      'paint-brush-broad', 'pipe', 'screwdriver', 'toolbox',
      'tree', 'wrench'
    ];
  
    let mounted = false;
  
    onMount(() => {
      mounted = true;
    });
  </script>
  
  {#if mounted}
    <div class="absolute inset-0 z-1 {patternClassName} overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-gray-50 to-transparent z-5" />
      <div class="absolute inset-0 grid grid-cols-6 md:grid-cols-6 lg:grid-cols-12 gap-2"style:opacity>
        {#each Array.from({ length: 72 }) as _, index}
          {@const iconName = backgroundIcons[index % backgroundIcons.length]}
          <div
            class="flex justify-center items-center"
            style:transform="rotate({Math.random() * 360}deg)"
          >
            <img
              src={`/images/filterSVGs/${iconName}.svg`}
              alt="Background Icon"
              class="w-6 h-6" 
            />
          </div>
        {/each}
      </div>
    </div>
  {/if}



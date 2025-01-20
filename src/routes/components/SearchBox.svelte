<!-- src/routes/components/SearchBox.svelte -->
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { MagnifyingGlass } from 'phosphor-svelte';
    //import { MagnifyingGlass2 } from 'phosphor-svelte/lib/MagnifyingGlass';
    
    const phrases = [
      "I need a plumber...",
      "I need a plumber to fish my wedding ring out of the garbage disposal...",
      "A carpenter to rebuild my confidenceafter my IKEA furniture assembly",
      "We need a electrician...",
      "Roof expert to stop my attic from becoming an indoor swimming pool...",
      "Lawn ninja to defeat my suburban jungle...",
    ];
    
    let placeholderText = "";
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let inputValue = "";
    let isFocused = false;
    let timer: ReturnType<typeof setTimeout>;
  
    function handleFocus() {
        isFocused = true;
        placeholderText = "";
    }
  
      function handleBlur() {
          if (!inputValue) {
          isFocused = false;
          charIndex = 0;
          }
      }
    
    onMount(() => {
          if (!isFocused) {
              const typingSpeed = 100;
              const deletingSpeed = 50;
              const pauseDuration = 2000;
  
              const typewriterEffect = () => {
                const currentPhrase = phrases[phraseIndex];
  
                if (!isDeleting) {
                  if (charIndex < currentPhrase.length) {
                    placeholderText = currentPhrase.substring(0, charIndex + 1);
                    charIndex += 1;
                  } else {
                    setTimeout(() => isDeleting = true, pauseDuration);
                    return;
                  }
                } else {
                  if (charIndex > 0) {
                    placeholderText = currentPhrase.substring(0, charIndex - 1);
                      charIndex -= 1;
                  } else {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    return;
                  }
                }
              };
              timer = setInterval(
                  typewriterEffect,
                  isDeleting ? deletingSpeed : typingSpeed
              );
        }
    });
  
    onDestroy(() => {
      clearInterval(timer);
    });
  
</script>

  <div class="relative w-full py-2 pb-16" style="background-image: linear-gradient(to right, transparent, rgb(229 231 235) 15%, rgb(229 231 235) 85%, transparent); background-position: bottom; background-size: 100% 1px; background-repeat: no-repeat;">
      <div class="relative flex items-start w-full overflow-hidden rounded-2xl bg-white p-4 border border-gray-100 shadow-sm">
          <div class="absolute left-[12px] top-[12px] p-4 rounded-full bg-orange-500">
             <MagnifyingGlass size={20} weight="bold" class="text-white" />
        </div>
          <textarea
              bind:value={inputValue}
              on:focus={handleFocus}
              on:blur={handleBlur}
              placeholder={placeholderText}
              class="w-full font-bold pl-16 pr-4 text-3xl text-gray-900 placeholder-gray-300 bg-transparent outline-none resize-none h-42 leading-tight"
          ></textarea>
    </div>
  </div>
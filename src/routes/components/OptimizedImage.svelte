  <!-- src/lib/components/OptimizedImage.svelte -->
  <script lang="ts">
    import { optimize } from '$lib/image';
    
    export let src: string;
    export let alt: string;
    export let customClasses:string = ''

</script>
 
 
<img
   class={`absolute left-0 top-0 w-full h-full object-cover rounded-xl  ${customClasses}`}
   srcset={optimize(src)}
   {alt}
 />
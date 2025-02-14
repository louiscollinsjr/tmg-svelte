<!-- Messages layout without navbar/footer -->
<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="h-screen bg-gray-50">
  <slot />
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>

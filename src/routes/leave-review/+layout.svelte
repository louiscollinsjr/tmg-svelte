<!-- Leave review layout without navbar/footer -->
<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="min-h-screen bg-white">
  <slot />
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>

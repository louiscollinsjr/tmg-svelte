<!-- src/lib/components/InitialsAvatar.svelte -->
<script lang="ts">
    export let name: string;
    export let size: 'sm' | 'lg' = 'sm';

    $: initials = name
        ?.split(' ')
        .map(word => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() ?? '';

    $: sizeClasses = size === 'sm' ? 'h-8 w-8 text-sm' : 'h-16 w-16 text-xl';
</script>

<div class="flex items-center justify-center {sizeClasses} rounded-full bg-black text-white font-medium">
    {initials}
</div>

<script lang="ts">
  import { formatDate } from '../../utils/formatDate';
  export let project;
  export let viewProject;
  export let dateField;
</script>

<button
  class="flex items-start overflow-hidden rounded-lg"
  on:click={() => viewProject(project._id)}
>
  <img
    class="h-24 w-24 object-cover rounded-xl"
    src={project.thumbnail || '/default-project.png'}
    alt={project.title}
  />
  <div class="pt-2 pl-4 text-left">
    <h3 class="text-xs font-medium text-gray-900">{project.title}</h3>
    <p class="text-xs text-gray-500">Work by {project.contractor?.name || 'Contractor'}</p>
    <p class="text-xs text-gray-500">{formatDate(project[dateField])}</p>
  </div>
</button>

<style>
  /* Add any additional styles here if needed */
</style>

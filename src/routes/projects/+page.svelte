<!-- Projects listing page -->
<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { HouseLine } from 'phosphor-svelte';
	import ProjectCard from './ProjectCard.svelte';

	export let data;

	let activeTab = 'in-progress';

	$: projects = data.projects || {
		inProgress: [],
		completed: [],
		archived: [],
		reviews: []
	};

	function handleCreateProject() {
		goto('/projects/create');
	}

	function viewProject(projectId: string) {
		goto(`/projects/${projectId}`);
	}

	function formatDate(date: string) {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<div class="mx-auto max-w-5xl px-4 py-8 pt-64 sm:px-6 lg:px-8">
	<!-- Header with CTA -->
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-[28px] font-semibold text-gray-900">Projects</h1>
	</div>

	<section
		class="mb-24 grid max-h-56 grid-cols-5 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
	>
		<div class="col-span-2 p-0 pr-12">
			<div class="max-w-xl p-4 pl-8 text-left">
				<HouseLine class="my-3 h-6 w-6 text-[#ff6923]" weight="duotone" />
				<h2 class="text-[10pt] font-bold text-gray-900">Ready to Kickstart Your Project...</h2>

				<p class="hidden text-[9pt] font-light text-gray-500 md:mt-2 md:block">
					Let&apos;s Begin! We&apos;re here to help you find the perfect Pro for your home
					improvement needs.
				</p>

				<div class="mt-4 md:mt-4">
					<a
						href="/start-project"
						class="text-thin inline-block rounded-lg bg-[#ff6923] px-5 py-3 font-roboto text-xs font-medium tracking-wide text-white transition"
					>
						Start a new project
					</a>
				</div>
			</div>
		</div>

		<img alt="" src="default-project.png" class="col-span-3 w-full object-cover" />
	</section>

	<!-- No projects state -->
	{#if !projects.inProgress.length && !projects.completed.length && !projects.archived.length && !projects.reviews.length}
		<div class="rounded-lg bg-white py-12 text-center shadow-sm" in:fade>
			<div class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
				<svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
			</div>
			<h3 class="mb-2 text-lg font-medium text-gray-900">No projects yet!</h3>
			<p class="mb-4 text-sm text-gray-500">
				Time to start your first project and bring your ideas to life.
			</p>
			<button
				class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
				on:click={() => goto('/start-project')}
			>
				Start a project
			</button>
		</div>
	{:else}
		<!-- Tabs -->
		<div class="mb-6 border-0 border-gray-200 pb-4">
			<nav class="flex space-x-8">
				<button
					class="medium py-0.5 text-[10pt] font-normal
                    {activeTab === 'in-progress'
						? 'rounded-full bg-black px-5 py-3 text-white'
						: 'rounded-full bg-gray-100 px-5 py-3 text-gray-900'}"
					on:click={() => (activeTab = 'in-progress')}
				>
					Active
					<!-- {#if projects.inProgress.length}
                        <span class="ml-2 py-0.5 px-1.5 rounded-full text-[8pt] font-medium bg-gray-100 text-gray-600">
                            {projects.inProgress.length}
                        </span>
                    {/if} -->
				</button>
				<button
					class="whitespace-nowrap text-[10pt] font-medium
                    {activeTab === 'completed'
						? 'rounded-full bg-black px-5 py-3 text-white'
						: 'rounded-full bg-gray-100 px-5 py-3 text-gray-900'}"
					on:click={() => (activeTab = 'completed')}
				>
					Completed
					<!-- {#if projects.completed.length}
                        <span class="ml-2 py-0.5 px-1.5 rounded-full text-[8pt] font-medium bg-gray-100 text-gray-600">
                            {projects.completed.length}
                        </span>
                    {/if} -->
				</button>
				<button
					class="whitespace-nowrap text-[10pt] font-medium
                    {activeTab === 'archived'
						? 'rounded-full bg-black px-5 py-3 text-white'
						: 'rounded-full bg-gray-100 px-5 py-3 text-gray-900'}"
					on:click={() => (activeTab = 'archived')}
				>
					Archived
					<!-- {#if projects.archived.length}
                        <span class="ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            {projects.archived.length}
                        </span>
                    {/if} -->
				</button>
				<button
					class="whitespace-nowrap text-[10pt] font-medium
                    {activeTab === 'reviews'
						? 'bg-black text-white rounded-full px-5 py-3' 
                        : 'bg-gray-100 text-gray-900 rounded-full px-5 py-3'}"
					on:click={() => (activeTab = 'reviews')}
				>
					Reviews
					<!-- {#if projects.reviews.length}
                        <span class="ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
                            {projects.reviews.length}
                        </span>
                    {/if} -->
				</button>
			</nav>
		</div>

		<!-- Project Grid -->
		<div class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
			{#if activeTab === 'in-progress'}
				{#each projects.inProgress as project}
					<ProjectCard {project} viewProject={viewProject} dateField="startDate" />
				{/each}
			{:else if activeTab === 'completed'}
				{#each projects.completed as project}
					<ProjectCard {project} viewProject={viewProject} dateField="completionDate" />
				{/each}
			{:else if activeTab === 'archived'}
				{#each projects.archived as project}
					<ProjectCard {project} viewProject={viewProject} dateField="updatedAt" />
				{/each}
			{:else}
				{#each projects.reviews as review}
					<ProjectCard project={review.project} viewProject={viewProject} dateField="date" />
				{/each}
			{/if}
		</div>
	{/if}
</div>

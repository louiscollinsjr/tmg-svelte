<script lang="ts">
	//import { page } from '$app/stores';
	import {page} from '$app/state';
	import { UserCircle, Archive, ThumbsUp, Star, ShareFat, Heart } from 'phosphor-svelte';
    import { goto } from '$app/navigation';
    import BackgroundPattern from '../components/BackgroundPattern.svelte';
    import InitialsAvatar from '$lib/components/InitialsAvatar.svelte';

	$: data = page.data;
	// $: console.log('Page data:', data);

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<div class="min-h-screen bg-gray-50">
    <BackgroundPattern opacity="0.05" patternClassName="bg-gray-50" />
	<div class="relative z-10 mx-auto max-w-[61.25rem] px-4 py-6 sm:px-6 lg:px-8">
		{#if data.session?.user}
			<div class="px-2 md:pt-32">
				<div class="rounded-2xl p-1 shadow-none">
					<div class="flex items-center space-x-4">
						<!-- User Profile Image and Info -->
						<div class="relative pt-3">
							{#if data.session.user.image}
								<img
									src={data.session.user.image}
									alt={data.session.user.name}
									class="h-16 w-16 rounded-full"
								/>
							{:else}
								<InitialsAvatar name={data.session.user.name} size="lg" />
							{/if}
						</div>
						<div>
							<div class="mt-4">
								<div class="flex items-center gap-2">
									<h2 class="pr-4 text-3xl font-semibold">{data.session.user.name}</h2>
									{#if data.userData.isPro}
										<div
											class="flex items-center gap-1 rounded-full bg-black px-4 py-1 text-xs font-bold text-white"
										>
											<span>TMG Verified Pro</span>
											<div class="rounded-full bg-green-500 p-0.5">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="currentColor"
													aria-hidden="true"
													data-slot="icon"
													class="h-3 w-3 text-white"
												>
													<path
														fill-rule="evenodd"
														d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
														clip-rule="evenodd"
													></path>
												</svg>
											</div>
										</div>
									{/if}
								</div>
								<p class="text-sm text-gray-600">{data.session.user.email}</p>
							</div>
						</div>
					</div>

					<!-- User Stats -->
					<div class="mt-6 grid grid-cols-3 gap-4 p-4 text-xs md:w-[35%]">
						<div class="text-left">
							<div class="text-gray-600">Projects</div>
							<div class="text-lg font-bold">{data.projects?.length || 0}</div>
						</div>
						<div class="text-left">
							<div class="text-gray-600">Reviews</div>
							<div class="text-lg font-bold">{data.reviews?.length || 0}</div>
						</div>
						<div class="text-left">
							<div class="text-gray-600">Rating</div>
							<div class="justify-left flex text-base">
								<div class="pt-1">
									<div class="flex">
										{#if data.reviews?.length}
											{#each Array(Math.floor(data.reviews.reduce((sum, review) => sum + review.rating, 0) / data.reviews.length)) as _}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="currentColor"
													aria-hidden="true"
													data-slot="icon"
													class="text-black-400 h-4 w-4"
												>
													<path
														fill-rule="evenodd"
														d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
														clip-rule="evenodd"
													></path>
												</svg>
											{/each}
											{#each Array(5 - Math.floor(data.reviews.reduce((sum, review) => sum + review.rating, 0) / data.reviews.length)) as _}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="currentColor"
													aria-hidden="true"
													data-slot="icon"
													class="text-black-400 h-4 w-4 opacity-50"
												>
													<path
														fill-rule="evenodd"
														d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
														clip-rule="evenodd"
													></path>
												</svg>
											{/each}
										{/if}
									</div>
								</div>
								{#if data.reviews?.length}
									<span class="ml-2 text-base font-semibold"
										>{(
											data.reviews.reduce((sum, review) => sum + review.rating, 0) /
											data.reviews.length
										).toFixed(2)}</span
									>
								{/if}
							</div>
						</div>
					</div>
				</div>

				<!-- My Projects Section -->
				<div class="my-8">
                    <div class="mb-8 flex items-center gap-4">
                        <h3 class="text-2xl font-semibold">My Projects</h3>
                        <button 
                        on:click={() => goto('/start-project')}
                        role="menuitem"
                        class="rounded-lg bg-[#000000] px-4 py-2 text-[10px] font-semibold text-[#ffffff] tracking-wider">Start a New Project</button>
                    </div>
					<div class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-2">
						{#if data.projects?.length}
							{#each data.projects as project}
								<div class="relative rounded-lg bg-[#f2f3EE] p-6 transition-shadow hover:shadow-md">
									<!-- Archive Button -->
									<button
										class="absolute right-3 top-3 rounded-full p-1.5 transition-colors hover:bg-gray-100"
										title="Archive project"
									>
										<Archive size={20} weight="duotone" />
									</button>
									<!-- Project Details -->
									<div class="mb-4 flex items-start justify-between text-[#64635f]">
										<div>
                                            <!-- pill for projec status red yellow green -->
											<h3 class="mb-2 text-sm font-semibold">{project.title}</h3>
											<p class="mb-3 line-clamp-2 text-xs text-[#64635f]">{project.description}</p>
										</div>
									</div>
									<div class="flex items-center justify-between text-sm">
										<div class="flex items-center gap-3">
											<span class="rounded-full py-1 text-xs font-medium capitalize text-[#64635f]"
												>{project.status}</span
											>
											<span class="text-xs text-[#64635f]">{formatDate(project.createdAt)}</span>
										</div>
									</div>
                                    <!-- Helpful Count -->
										<div class="mt-auto flex items-center justify-between pt-3 text-xs">
											<div class="flex items-center gap-2">
												<span class="text-gray-400"
													>0 people found this helpful</span
												>
											</div>
										</div>
										<div class="flex-col-3 flex items-center gap-3 pt-2 text-xs text-gray-400">
											<button class="flex items-center gap-1">
												<ThumbsUp size={13} weight="duotone" />
												<span class="text-[11px] text-gray-400">Helpful</span>
											</button>
											|
											<button class="text-[11px] text-gray-400">Report</button> |
                                            <button class="text-[11px] text-gray-400 cursor-pointer" on:click={() => {}}>Write a review</button>
										</div>
								</div>
							{/each}
						{:else}
							<p class="p-4 text-center text-gray-600">No projects found.</p>
						{/if}
					</div>
				</div>

				<!-- My Reviews Section -->
				<div class="mt-12">
					<h3 class="mb-8 text-2xl font-semibold">My Reviews</h3>
					<div class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-2">
						{#if data.reviews?.length}
							{#each data.reviews as review}
								<div class="rounded-lg bg-[#f2f3EE] p-6 transition-shadow hover:shadow-md">
									<div class="flex flex-col text-[#64635f]">
										<!-- Reviewer Info -->
										<div class="mb-2 flex items-start gap-2">
											<UserCircle size={20} weight="duotone" class="mt-1" />
											<div class="flex flex-col">
												<span class="text-sm font-bold">{review.contractor.name}</span>
												{#if review.contractor.businessInfo?.companyName}
													<span class="text-xs text-gray-500"
														>{review.contractor.businessInfo.companyName}</span
													>
												{/if}
											</div>
										</div>
										<!-- Rating and Review Summary -->
										<div class="mb-1 flex items-center justify-between">
											<div class="flex items-center gap-2">
												<div class="flex">
													{#each Array(5) as _, i}
														{#if (review.rating || 0) >= i + 1}
															<!-- Full star -->
															<svg
																class="h-3 w-3 text-gray-600"
																fill="currentColor"
																viewBox="0 0 20 20"
															>
																<path
																	d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
																/>
															</svg>
														{:else if (review.rating || 0) > i && (review.rating || 0) < i + 1}
															<!-- Half star -->
															<svg
																class="h-3 w-3 text-gray-600"
																fill="currentColor"
																viewBox="0 0 20 20"
															>
																<defs>
																	<linearGradient id="half-fill" x1="0" x2="100%" y1="0" y2="0">
																		<stop offset="50%" stop-color="currentColor" />
																		<stop offset="50%" stop-color="#D1D5DB" />
																	</linearGradient>
																</defs>
																<path
																	fill="url(#half-fill)"
																	d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
																/>
															</svg>
														{:else}
															<!-- Empty star -->
															<svg
																class="h-3 w-3 text-gray-300"
																fill="currentColor"
																viewBox="0 0 20 20"
															>
																<path
																	d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
																/>
															</svg>
														{/if}
													{/each}
												</div>
												<span class="text-xs text-gray-600">
													{review.title}
													<!-- {(review.rating || 0).toFixed(1)} {review.title} -->
												</span>
											</div>
										</div>
										<!-- Review Date and Content -->
										<p class="mb-3 line-clamp-3 text-xs text-[#64635f]">
											Reviewed on {formatDate(review.createdAt)}
										</p>
										<p class="mb-3 line-clamp-3 text-xs text-[#64635f]">{review.content}</p>
										<!-- Helpful Count -->
										<div class="mt-auto flex items-center justify-between pt-3 text-xs">
											<div class="flex items-center gap-2">
												<span class="text-gray-400"
													>{review.helpful?.count || 0} people found this helpful</span
												>
											</div>
										</div>
										<div class="flex-col-3 flex items-center gap-3 pt-2 text-[11px] text-gray-400">
											<button
                                            title="Helpful">
                                                <ThumbsUp size={13} />
                                            </button>|<button
                                            title="Report">
                                                Report
                                            </button>
										</div>
									</div>
								</div>
							{/each}
						{:else}
							<p class="p-4 text-center text-gray-600">No reviews found.</p>
						{/if}
					</div>
				</div>
			</div>
		{:else}
			<p class="p-4 text-center text-gray-600">Please sign in to view your profile.</p>
		{/if}
	</div>
</div>

<style>
</style>

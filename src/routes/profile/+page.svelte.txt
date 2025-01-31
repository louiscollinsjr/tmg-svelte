<!-- src/routes/profile/+page.svelte -->
<script lang="ts">
    import { page } from '$app/stores';
    $: data = $page.data;
    $: console.log('Page data:', data);

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
</script>

{#if data.session?.user}
    <div class="profile-container">
        <section class="profile-header">
            <img src={data.session.user.image} alt="Profile" width="100" />
            <div class="profile-info">
                <h1>{data.session.user.name}</h1>
                <p class="email">{data.session.user.email}</p>
            </div>
        </section>
        
        {#if data.userData}
            <section class="account-info">
                <h2>Account Information</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="label">Status:</span>
                        <span class="value">{data.userData.status}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Member since:</span>
                        <span class="value">{formatDate(data.userData.createdAt)}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Last active:</span>
                        <span class="value">{formatDate(data.userData.lastActive)}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Pro member:</span>
                        <span class="value">{data.userData.isPro ? 'Yes' : 'No'}</span>
                    </div>
                </div>
            </section>

            <section class="reviews">
                <h2>Reviews</h2>
                {#if data.reviews?.length}
                    <div class="reviews-grid">
                        {#each data.reviews as review}
                            <div class="review-card">
                                <div class="review-header">
                                    <h3>{review.title}</h3>
                                    <div class="rating">
                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                    </div>
                                </div>
                                <p class="review-content">{review.content}</p>
                                {#if review.projectDetails}
                                    <div class="project-info">
                                        <p class="project-title">Project: {review.projectDetails.title}</p>
                                    </div>
                                {/if}
                                <div class="review-metadata">
                                    <span class="date">{formatDate(review.createdAt)}</span>
                                    <span class="helpful">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                                        </svg>
                                        {review.helpful?.count || 0}
                                    </span>
                                </div>
                                {#if review.images?.length}
                                    <div class="review-images">
                                        {#each review.images as image}
                                            <img src={image.url} alt={image.caption || 'Review image'} />
                                        {/each}
                                    </div>
                                {/if}
                                {#if review.responses?.length}
                                    <div class="responses">
                                        {#each review.responses as response}
                                            <div class="response">
                                                <p>{response.content}</p>
                                                <div class="response-meta">
                                                    <span class="response-type">{response.isContractor ? 'Contractor' : 'Owner'}</span>
                                                    <span class="response-date">{formatDate(response.timestamp)}</span>
                                                </div>
                                            </div>
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                {:else}
                    <p class="no-reviews">No reviews found.</p>
                {/if}
            </section>

            <section class="projects">
                <h2>Projects</h2>
                {#if data.projects?.length}
                    <div class="projects-grid">
                        {#each data.projects as project}
                            <div class="project-card">
                                <h3>{project.title}</h3>
                                <p class="description">{project.description}</p>
                                <div class="project-details">
                                    <span class="status">Status: {project.status}</span>
                                    <span class="location">Location: {project.metadata.location}</span>
                                    <span class="budget">Budget: ${project.metadata.budget.toLocaleString()}</span>
                                    <span class="timeline">Timeline: {project.metadata.timeline}</span>
                                </div>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <p class="no-projects">No projects found.</p>
                {/if}
            </section>
        {/if}
    </div>
{:else}
    <p class="sign-in-message">Please sign in to view your profile.</p>
{/if}

<style>
    .profile-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .profile-header {
        display: flex;
        align-items: center;
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .profile-header img {
        border-radius: 50%;
        border: 3px solid #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .profile-info h1 {
        margin: 0;
        color: #2d3748;
    }

    .email {
        color: #718096;
        margin-top: 0.5rem;
    }

    section {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    h2 {
        color: #2d3748;
        margin-top: 0;
        margin-bottom: 1.5rem;
        font-size: 1.5rem;
    }

    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }

    .info-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .label {
        color: #718096;
        font-size: 0.875rem;
    }

    .value {
        font-weight: 500;
        color: #2d3748;
    }

    .reviews-grid, .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .review-card {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 1.5rem;
        transition: transform 0.2s;
    }

    .review-card:hover {
        transform: translateY(-2px);
    }

    .review-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
    }

    .review-header h3 {
        margin: 0;
        color: #2d3748;
    }

    .rating {
        color: #ecc94b;
        font-size: 1.25rem;
    }

    .review-content {
        color: #4a5568;
        margin-bottom: 1rem;
        line-height: 1.6;
    }

    .project-info {
        background: #f7fafc;
        padding: 0.75rem;
        border-radius: 6px;
        margin-bottom: 1rem;
    }

    .project-title {
        margin: 0;
        font-weight: 500;
        color: #2d3748;
    }

    .review-metadata {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #718096;
        font-size: 0.875rem;
    }

    .helpful {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .review-images {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }

    .review-images img {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-radius: 6px;
    }

    .responses {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e2e8f0;
    }

    .response {
        background: #f7fafc;
        padding: 1rem;
        border-radius: 6px;
        margin-top: 1rem;
    }

    .response p {
        margin: 0;
        color: #4a5568;
    }

    .response-meta {
        display: flex;
        justify-content: space-between;
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: #718096;
    }

    .project-card {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 1.5rem;
        transition: transform 0.2s;
    }

    .project-card:hover {
        transform: translateY(-2px);
    }

    .project-card h3 {
        margin: 0 0 1rem 0;
        color: #2d3748;
    }

    .description {
        color: #4a5568;
        margin-bottom: 1rem;
        line-height: 1.6;
    }

    .project-details {
        display: grid;
        gap: 0.5rem;
        color: #718096;
        font-size: 0.875rem;
    }

    .no-reviews, .no-projects, .sign-in-message {
        text-align: center;
        color: #718096;
        padding: 2rem;
        background: #f7fafc;
        border-radius: 8px;
    }
</style>
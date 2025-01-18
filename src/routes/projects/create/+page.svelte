<script lang="ts">
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';

    let tags = ['renovation', 'new construction', 'repair', 'maintenance'];
    let selectedTags: string[] = [];
    let formError = '';

    function toggleTag(tag: string) {
        const index = selectedTags.indexOf(tag);
        if (index === -1) {
            selectedTags = [...selectedTags, tag];
        } else {
            selectedTags = selectedTags.filter(t => t !== tag);
        }
    }

    function handleSubmit(event: SubmitEvent) {
        const form = event.target as HTMLFormElement;
        const budget = form.budget.value;
        
        if (isNaN(Number(budget)) || Number(budget) <= 0) {
            event.preventDefault();
            formError = 'Please enter a valid budget amount';
            return;
        }
        
        formError = '';
    }
</script>

<div class="create-project">
    <h1>Create New Project</h1>
    
    <form 
        method="POST" 
        action="?/create" 
        use:enhance 
        on:submit={handleSubmit}
        class="project-form"
    >
        <div class="form-group">
            <label for="title">Project Title*</label>
            <input 
                type="text" 
                id="title" 
                name="title" 
                required 
                placeholder="e.g., Modern Kitchen Renovation"
            />
        </div>

        <div class="form-group">
            <label for="description">Description*</label>
            <textarea 
                id="description" 
                name="description" 
                required 
                rows="4"
                placeholder="Describe your project in detail..."
            ></textarea>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label for="budget">Budget (USD)*</label>
                <input 
                    type="number" 
                    id="budget" 
                    name="budget" 
                    required 
                    min="1"
                    placeholder="e.g., 50000"
                />
            </div>

            <div class="form-group">
                <label for="timeline">Timeline*</label>
                <input 
                    type="text" 
                    id="timeline" 
                    name="timeline" 
                    required 
                    placeholder="e.g., 3 months"
                />
            </div>
        </div>

        <div class="form-group">
            <label for="location">Location*</label>
            <input 
                type="text" 
                id="location" 
                name="location" 
                required 
                placeholder="e.g., San Francisco, CA"
            />
        </div>

        <div class="form-group">
            <label for="project-tags">Project Tags</label>
            <div class="tags-container" id="project-tags" role="group" aria-label="Project tags">
                {#each tags as tag}
                    <label class="tag-checkbox">
                        <input 
                            type="checkbox" 
                            name="tags" 
                            value={tag}
                            checked={selectedTags.includes(tag)}
                            on:change={() => toggleTag(tag)}
                        />
                        <span class="tag-label">{tag}</span>
                    </label>
                {/each}
            </div>
        </div>

        {#if formError}
            <div class="error-message">
                {formError}
            </div>
        {/if}

        {#if $page.form?.error}
            <div class="error-message">
                {$page.form.error}
            </div>
        {/if}

        <button type="submit" class="submit-button">
            Create Project
        </button>
    </form>
</div>

<style>
    .create-project {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        color: #2d3748;
        margin-bottom: 2rem;
        font-size: 2rem;
    }

    .project-form {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        color: #4a5568;
        font-weight: 500;
    }

    input, textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
        font-size: 1rem;
        transition: border-color 0.2s;
    }

    input:focus, textarea:focus {
        outline: none;
        border-color: #4f46e5;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
    }

    .tag-checkbox {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .tag-checkbox input[type="checkbox"] {
        width: auto;
    }

    .tag-label {
        background: #f7fafc;
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        color: #4a5568;
        cursor: pointer;
        transition: all 0.2s;
    }

    .tag-checkbox input[type="checkbox"]:checked + .tag-label {
        background: #4f46e5;
        color: white;
    }

    .error-message {
        color: #e53e3e;
        margin-bottom: 1rem;
        padding: 0.75rem;
        background: #fff5f5;
        border-radius: 0.375rem;
        border: 1px solid #feb2b2;
    }

    .submit-button {
        width: 100%;
        padding: 0.75rem;
        background: #4f46e5;
        color: white;
        border: none;
        border-radius: 0.375rem;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .submit-button:hover {
        background: #4338ca;
    }

    @media (max-width: 640px) {
        .form-row {
            grid-template-columns: 1fr;
        }
    }
</style>

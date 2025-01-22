<script lang="ts">
    import { signIn } from '@auth/sveltekit/client';
    export let data;
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8">
        <div class="text-center">
            <h2 class="text-3xl font-bold">Sign in to your account</h2>
            <p class="mt-2 text-gray-600">
                Or <a href="/" class="text-black hover:underline">continue as guest</a>
            </p>
        </div>

        <div class="mt-8 space-y-6">
            <button
                type="button"
                on:click={() => signIn('google', { callbackUrl: data.url })}
                class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
                <img src="/images/google-icon-logo.svg" alt="Google" class="w-5 h-5" />
                Continue with Google
            </button>
        </div>
    </div>
</div>

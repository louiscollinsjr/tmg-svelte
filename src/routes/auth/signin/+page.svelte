<!-- src/routes/auth/signin/+page.svelte -->
<script lang="ts">
    import { signIn } from '@auth/sveltekit/client';
	import { goto } from '$app/navigation';
    import { invalidateAll } from '$app/navigation';
    let error:string
    let loading:boolean

    
    const handleSignUp = async (e:Event) => {
        loading = true;
        const data = new FormData(e.target as HTMLFormElement);
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({email: data.get('email'), password: data.get('password')}),
            headers: {
                'Content-Type': 'application/json',
            }
        })
         const result = await res.json();
         loading = false;
        if (result?.success) {
            goto('/login');
        } else {
            error = 'Could not create user'
        }
    }
</script>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8">
        <div class="text-center">
            <h2 class="text-3xl font-bold">Create your account</h2>
              <p class="mt-2 text-gray-600">
                  Welcome! Please fill in the details to get started.
                 </p>
            
        </div>

        <div class="mt-8 space-y-6">
                <form method="POST" action="?/default">
                    <button
                        type="submit"
                        class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                        <img src="/images/google-icon-logo.svg" alt="Google" class="w-5 h-5" />
                        Continue with Google
                    </button>
                </form>

               
         <div class="relative">
                <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
                 </div>
                <div class="relative flex justify-center text-sm">
                <span class="bg-[#f8f7f3] px-2 text-gray-500">or</span>
                 </div>
        </div>
        <form  class="flex flex-col gap-4" on:submit|preventDefault={handleSignUp}>
               <div class="grid grid-cols-2 gap-4">
                    <input class="border border-gray-300 p-2 rounded-md" type="text" placeholder="First Name" name="firstName"  />
                    <input class="border border-gray-300 p-2 rounded-md" type="text" placeholder="Last Name" name="lastName" />
               </div>
                    <input class="border border-gray-300 p-2 rounded-md" type="text" placeholder="Username" name="userName" required />
                <input class="border border-gray-300 p-2 rounded-md" type="email" placeholder="Email address" name="email" required  />
                <div class="relative">
                <select
                   class="w-full appearance-none rounded-lg border border-gray-300 bg-[#f8f7f3] px-3 py-2 pr-12 focus:border-black focus:ring-black"
                   required
                    >
                    <option value="">US</option>
                </select>
                <input class="border border-gray-300 p-2 rounded-md" type="text" placeholder="Phone number" name="phone" required />
                </div>
                <input class="border border-gray-300 p-2 rounded-md" type="password" placeholder="Password" name="password" required />
            
                {#if error}
                            <p class='text-red-500'>{error}</p>
                        {/if}
                        {#if loading}
                            <p>Loading...</p>
                        {/if}
             <button  class="bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Continue</button>
                </form>
                 <p class="text-center text-sm text-gray-500">
                   Already have an account? <a href='/login' class="text-black hover:underline">Sign in</a>
                </p>

                <p class="text-center text-xs text-gray-500 mt-4">
                    Secured by <span class="text-gray-900 font-bold"> tmg.</span>
                  </p>
        </div>
    </div>
</div>
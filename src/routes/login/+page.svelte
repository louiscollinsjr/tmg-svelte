<!-- src/routes/login/+page.svelte -->
<script lang="ts">
    import { goto } from '$app/navigation';
  import { auth } from '$lib/stores';
    let error:string
    let loading:boolean


    const handleLogin = async (e:Event) => {
        loading = true;

        const data = new FormData(e.target as HTMLFormElement);

        const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({email: data.get('email'), password: data.get('password')}),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

         const result = await res.json();
        loading = false;
         if (result?.success) {
            goto('/profile');
        } else {
                error = 'Could not login'
        }
     }
</script>
<div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8">
        <div class="text-center">
            <h2 class="text-3xl font-bold">Sign in to your account</h2>
              <p class="mt-2 text-gray-600">
                Welcome Back! Please sign in with your email and password.
                 </p>
        </div>

        <div class="mt-8 space-y-6">

        <form class="flex flex-col gap-4" on:submit|preventDefault={handleLogin}>
           <input  class="border border-gray-300 p-2 rounded-md" type="email" placeholder="Email" name="email"  required/>
           <input  class="border border-gray-300 p-2 rounded-md" type="password" placeholder="Password" name="password" required/>
             {#if error}
               <p class='text-red-500'>{error}</p>
           {/if}
            {#if loading}
               <p>Loading...</p>
           {/if}
        <button class="bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Sign In</button>
         </form>
          <p class="text-center text-sm text-gray-500">
            Don't have an account? <a href='/auth/signin' class="text-black hover:underline">Sign up</a>
           </p>

                <p class="text-center text-xs text-gray-500 mt-4">
                    Secured by <span class="text-gray-900 font-bold"> clerk</span>
                </p>
        </div>
    </div>
</div>
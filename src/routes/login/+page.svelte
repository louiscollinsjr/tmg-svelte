<!-- src/routes/login/+page.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { auth } from '$lib/stores';
  import BackgroundPattern from '../components/BackgroundPattern.svelte';
  import { signIn } from '@auth/sveltekit/client';


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
     async function handleGoogleSignIn(e: Event) {
        e.preventDefault();
        try {
            // Clear existing auth state
            document.cookie.split(';').forEach(cookie => {
                const [name] = cookie.split('=').map(c => c.trim());
                if (name.startsWith('next-auth') || name.includes('auth')) {
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
                }
            });
            
            auth.set(null); // Reset auth store

            await signIn('google', { 
                callbackUrl: '/profile', // Or your desired redirect path
                prompt: 'select_account'
            });
        } catch (error) {
            console.error('[Login] Google sign-in error:', error);
            error = 'Failed to sign in with Google';
        }
    }
</script>


<div class="">
	<BackgroundPattern opacity="0.05" patternClassName="bg-[#09a7a8]/15" />
	<div class="relative flex min-h-screen items-center justify-center">
    <!-- create reponsive two colmns that are equal in size and centered oneside-->
 <div class="flex space-x-4">
  <div class="flex flex-col min-w-1/2 pt-4">
   
    <!-- in case we need to add content for signing in-->
  </div>
		<div class="w-full max-w-md space-y-8 rounded-lg bg-[#f8f7f3] p-10 shadow-lg border border-gray-200">
			<div class="pt-2 text-center">
				<h2 class="font-sourceserif text-3xl">Sign in to TryMyGuys</h2>
				<p class="mt-4 text-sm text-gray-600">
					Welcome back! Please fill in the details to get started.
				</p>
			</div>


			<div class="mt-8 space-y-6">
				<form method="POST" action="?/default">
					<div class="flex-2 flex flex-col space-y-4">
						<div class="flex space-x-4 text-sm">
							<button
    type="button"
    on:click|preventDefault={handleGoogleSignIn}
    class="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-[#f8f7f3] px-2 py-2 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
>
								<svg
									width="16"
									height="16"
									fill="none"
									viewBox="-3 0 262 262"
									xmlns="http://www.w3.org/2000/svg"
									preserveAspectRatio="xMidYMid"
									><path
										d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
										fill="#4285F4"
									/><path
										d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
										fill="#34A853"
									/><path
										d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
										fill="#FBBC05"
									/><path
										d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
										fill="#EB4335"
								/></svg
							>
							Google
						</button>
						<button disabled
							type="submit"
							class="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-[#f8f7f3] px-4 py-3 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
						>
							<svg
								height="16"
								width="16"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 -3.552713678800501e-15 820 950"
								><path
									d="M404.345 229.846c52.467 0 98.494-20.488 138.08-61.465s59.38-88.626 59.38-142.947c0-5.966-.472-14.444-1.414-25.434-6.912.942-12.096 1.727-15.552 2.355-48.383 6.908-90.954 30.615-127.713 71.12-36.758 40.506-55.137 83.838-55.137 129.996 0 5.337.785 14.13 2.356 26.375zM592.379 950c37.387 0 78.701-25.59 123.943-76.772S796.122 761.915 820 692.836c-88.912-45.844-133.368-111.626-133.368-197.348 0-71.591 35.973-132.82 107.92-183.688-49.954-62.486-115.931-93.729-197.931-93.729-34.56 0-66.134 5.181-94.724 15.543l-17.908 6.594-24.035 9.42c-15.709 5.966-30.004 8.95-42.885 8.95-10.054 0-23.25-3.455-39.586-10.363l-18.38-7.536-17.436-7.065c-25.449-10.676-52.782-16.014-82-16.014-78.23 0-141.065 26.376-188.506 79.128C23.72 349.479 0 419.03 0 505.379c0 121.517 38.015 233.772 114.046 336.763C166.828 914.047 215.054 950 258.724 950c18.537 0 36.916-3.611 55.138-10.833l23.092-9.42 18.38-6.594c25.762-9.106 49.482-13.659 71.16-13.659 22.935 0 49.326 5.81 79.173 17.427l14.609 5.652C550.75 944.191 574.786 950 592.379 950z"
							/></svg
						>
						Apple
					</button>
				</div>
			</form>

			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-200"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="bg-[#f8f7f3] px-2 text-gray-500">or</span>
				</div>
			</div>
			<form class="flex flex-col gap-4">
				
				<!-- <input class="border border-gray-300 bg-[#f8f7f3] p-2 rounded-md" type="text" placeholder="Username" name="userName" required /> -->
				<p class=" text-sm text-gray-900" aria-label="email">Email address</p>
                <input
					class="rounded-md border border-gray-300 bg-[#f8f7f3] p-2 text-sm placeholder:text-gray-200" 
    
					type="email"
					placeholder="Enter your email address"
					name="email"
					required
				/>
                <p class=" text-sm text-gray-900" aria-label="email">Password</p>
				<input
					class="rounded-md border border-gray-300 bg-[#f8f7f3] p-2 text-sm placeholder:text-gray-200"
					type="password"
					placeholder="Enter your password"
					name="password"
					required
				/>

				<div class="relative pt-8">
					<button
						class="focus:shadow-outline shadow-sm w-full rounded-lg bg-[#ff6823] px-4 py-2 font-roboto text-sm text-white hover:bg-[#ff6823] focus:outline-none"
						type="submit">Continue</button
					>
				</div>
			</form>
			<p class="text-center text-[13px] font-normal font-roboto text-gray-500">
				Don’t have an account? <a href="/auth/signup" class="text-[#ff6823] text-xs font-bold hover:underline">Sign up</a>
			</p>

			<p class="mt-4 text-center text-xs text-gray-500">
				Secured by <span class="font-bold text-gray-900"> tmg.</span>
			</p>
		</div>
      </div>
		</div>
	</div>
</div>



<!-- <div class="min-h-screen flex items-center justify-center bg-gray-50">
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
</div> -->
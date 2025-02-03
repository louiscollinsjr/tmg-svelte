<!-- src/routes/auth/signup/+page.svelte -->
<script>
	import BackgroundPattern from '../../components/BackgroundPattern.svelte';
  import { goto } from '$app/navigation';
  import { auth } from '$lib/stores';
  import { signIn } from '@auth/sveltekit/client';

  

  export const benefits = [
  {
    name: "Steady Work",
    description:
      "Enjoy a steady flow of job opportunities—no client searching needed.",
    image: "/steadywork.png",
    icon: `<svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.0"
        stroke="currentColor"
        class="w-full h-full"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
        />
      </svg>`,
  },
  {
    name: "Direct Connections",
    description:
      "Communicate easily with homeowners to ask questions and build trust.",
    image: "/directconnections.png",
    icon: `<svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-full h-full"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
        />
      </svg>`,
  },
  {
    name: "Build Your Reputation",
    description:
      "Earn positive reviews to build credibility and attract more clients.",
    image: "/buildreputation.png",
    icon: `<svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-full h-full"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
      </svg>`,
  },
  {
    name: "Easy Job Matching",
    description:
      "Get matched with projects that align with your skills and schedule",
    image: "/easyjobmatching.png",
    icon: `<svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-full h-full"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59"
        />
      </svg>`,
  },
  {
    name: "Save on Advertising",
    description: "We promote your services at no extra cost.",
    image: "/advertise.png",
    icon: `<svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-full h-full"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>`,
  },
  {
    name: "Expand Your Network",
    description:
      "Connect with homeowners and professionals to unlock new opportunities.",
    image: "/expandwork.png",
    icon: `<svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-full h-full"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
        />
      </svg>`,
  },

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
];

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Shuffle the benefits and select the first four
  const selectedBenefits = shuffle([...benefits]).slice(0, 4);
 </script>

<div class="">
	<BackgroundPattern opacity="0.05" patternClassName="bg-[#09a7a8]/15" />
	<div class="relative flex min-h-screen items-center justify-center">
    <!-- create reponsive two colmns that are equal in size and centered oneside-->
 <div class="flex space-x-4">
  <div class="flex flex-col min-w-1/2 pt-4">
    <!-- tmg svg logo -->
    <img src="/images/tmg_flags.png" alt="Try My Guys Logo" class="w-28 h-auto ml-0" />
    <!-- benefits of using trymyguys list -->
    <div class="">
      <ul class="mt-4 ml-4 space-y-12 pt-10 w-[65%] font-roboto">
        {#each selectedBenefits as benefit}
        <li>
          <h2 class="flex items-center gap-x-2 text-[16px] font-medium text-gray-1200">
            <div class="icon h-5 w-5 text-gray-400">
              {@html benefit.icon}
            </div>
            {benefit.name}
          </h2>
          <p class="mt-2 text-gray-500 text-sm">{benefit.description}</p>
        </li>
        {/each }
      </ul>
    </div>
  </div>
		<div class="w-full max-w-md space-y-8 rounded-lg bg-[#f8f7f3] p-10 shadow-lg border border-gray-200">
			<div class="pt-2 text-center">
				<h2 class="font-sourceserif text-3xl">Create your account</h2>
				<p class="mt-4 text-sm text-gray-600">
					Welcome! Please fill in the details to get started.
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
				<div class="grid grid-cols-2 gap-4">
          <!-- First Name Group -->
          <div class="space-y-1">
              <p class="text-sm text-gray-900">First name</p>
              <input
                  class="w-full rounded-md border border-gray-300 bg-[#f8f7f3] p-2 placeholder:text-gray-200"
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  required
              />
          </div>
      
          <!-- Last Name Group -->
          <div class="space-y-1">
              <p class="text-sm text-gray-900">Last name</p>
              <input
                  class="w-full rounded-md border border-gray-300 bg-[#f8f7f3] p-2 placeholder:text-gray-200"
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  required
              />
          </div>
      </div>
				<!-- <input class="border border-gray-300 bg-[#f8f7f3] p-2 rounded-md" type="text" placeholder="Username" name="userName" required /> -->
				<p class=" text-sm text-gray-900" aria-label="email">Email address</p>
        <input
					class="rounded-md border border-gray-300 bg-[#f8f7f3] p-2 text-sm placeholder:text-gray-200" 
					type="email"
					placeholder="Email address"
					name="email"
					required
				/>
        <p class=" text-sm text-gray-900" aria-label="email">Password</p>
				<input
					class="rounded-md border border-gray-300 bg-[#f8f7f3] p-2 text-sm placeholder:text-gray-200"
					type="password"
					placeholder="Password"
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
			<p class="text-center text-sm text-gray-500">
				Already have an account? <a href="/login" class="text-[#ff6823] text-xs font-bold hover:underline">Sign in</a>
			</p>

			<p class="mt-4 text-center text-xs text-gray-500">
				Secured by <span class="font-bold text-gray-900"> tmg.</span>
			</p>
		</div>
      </div>
		</div>
	</div>
</div>

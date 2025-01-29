// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />


declare global {
    namespace App {
        interface Locals {
            formSession: {
                get: () => Promise<any>;
                set: (data: any) => Promise<void>;
                clear: () => Promise<void>;
            };
        }
    }
}

// declare global {
// 	namespace App {
// 		// interface Error {}
// 		// interface Locals {}
// 		// interface PageData {}
// 		// interface PageState {}
// 		// interface Platform {}
// 	}
// }

declare module "*.svelte" {
	export { SvelteComponent as default } from "svelte";
}

declare namespace svelteHTML {
	interface HTMLAttributes<T> {
		[key: string]: any;
	}
}




export {};

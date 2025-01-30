// src/app.d.ts
/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />

import type { Session } from '@auth/core/types';
import type { ProjectFormData } from '$lib/types/project';

declare global {
    namespace App {
        interface Locals {
            formSession: {
                get: () => Promise<ProjectFormData | null>;
                set: (data: ProjectFormData) => Promise<void>;
                clear: () => Promise<void>;
            };
            auth: () => Promise<Session | null>;
            session: Session | null;
        }

        interface PageData {
            session: Session | null;
        }
    }
}

declare module "*.svelte" {
    export { SvelteComponent as default } from "svelte";
}

declare namespace svelteHTML {
    interface HTMLAttributes<T> {
        [key: string]: any;
    }
}

export { };
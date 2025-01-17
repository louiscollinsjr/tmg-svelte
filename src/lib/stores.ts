    // src/lib/stores.ts
import { writable } from 'svelte/store';
import type { Session } from '@auth/core/types';

export const auth = writable<Session | null>(null);
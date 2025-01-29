// src/lib/server/storage/formSession.ts
import type { MongoClient } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';
import { MongoClient } from 'mongodb';

const client = new MongoClient(MONGODB_URI);
const FORM_SESSION_COLLECTION = 'formSessions';

export interface FormSessionStorage {
    get: (sessionId: string) => Promise<any>;
    set: (sessionId: string, data: any) => Promise<void>;
    clear: (sessionId: string) => Promise<void>;
}

export class MongoFormSessionStorage implements FormSessionStorage {
    private client: MongoClient;
    
    constructor(client: MongoClient) {
        this.client = client;
    }
    
    async get(sessionId: string) {
        const db = this.client.db();
        const session = await db.collection(FORM_SESSION_COLLECTION)
            .findOne({ _id: sessionId });
        return session?.data || null;
    }
    
    async set(sessionId: string, data: any) {
        const db = this.client.db();
        await db.collection(FORM_SESSION_COLLECTION).updateOne(
            { _id: sessionId },
            { 
                $set: { 
                    data,
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );
    }
    
    async clear(sessionId: string) {
        const db = this.client.db();
        await db.collection(FORM_SESSION_COLLECTION)
            .deleteOne({ _id: sessionId });
    }
}

// Initialize storage
const formSessionStorage = new MongoFormSessionStorage(client);

// Updated handle function
export const handleFormSession: Handle = async ({ event, resolve }) => {
    const formSessionId = event.cookies.get('form_session');
    
    event.locals.formSession = {
        get: async () => {
            if (!formSessionId) return null;
            return await formSessionStorage.get(formSessionId);
        },
        set: async (data: any) => {
            const sessionId = crypto.randomUUID();
            await formSessionStorage.set(sessionId, data);
            event.cookies.set('form_session', sessionId, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                secure: true,
                maxAge: 60 * 30 // 30 minutes
            });
        },
        clear: async () => {
            if (formSessionId) {
                await formSessionStorage.clear(formSessionId);
                event.cookies.delete('form_session', { path: '/' });
            }
        }
    };

    return await resolve(event);
};
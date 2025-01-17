// src/lib/server/auth.ts
import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/core/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from 'mongodb';
import { GITHUB_ID, GITHUB_SECRET, GOOGLE_ID, GOOGLE_SECRET, AUTH_SECRET, MONGODB_URI } from "$env/static/private";

const uri = MONGODB_URI;
const client = new MongoClient(uri);



export const authHandler = SvelteKitAuth({
    adapter: MongoDBAdapter(client),
    providers: [
        Google({clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET}),
    ],
    secret: AUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({token, user, account}) {
            if (account && user) {
                token.id = user.id;
            }
            return token
        },
        async session({session, token}) {
                if (session?.user) {
                    session.user.id = token.id as string
                }
            return session;
        }
    },
     pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    }
});
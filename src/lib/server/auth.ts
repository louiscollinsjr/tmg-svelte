// src/lib/server/auth.ts
import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/core/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient, ObjectId } from 'mongodb';
import { AUTH_GOOGLE_CLIENT_ID, AUTH_GOOGLE_CLIENT_SECRET, AUTH_SECRET, MONGODB_URI } from "$env/static/private";

const uri = MONGODB_URI;
const client = new MongoClient(uri);

export const authHandler = SvelteKitAuth({
    adapter: MongoDBAdapter(client),
    providers: [
        Google({
            clientId: AUTH_GOOGLE_CLIENT_ID, 
            clientSecret: AUTH_GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true
        }),
    ],
    secret: AUTH_SECRET,
    trustHost: true,
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                const db = client.db('tmg-ai-assist-db');
                const existingUser = await db.collection('users').findOne({ email: user.email });
                
                if (!existingUser) {
                    await db.collection('users').insertOne({
                        _id: new ObjectId(user.id),
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        isPro: false,
                        providers: [{
                            name: account.provider,
                            providerId: profile.sub,
                            lastLogin: new Date()
                        }],
                        businessInfo: {
                            serviceArea: [],
                            specialties: []
                        },
                        preferences: {
                            notifications: {
                                email: true,
                                push: true,
                                marketing: false
                            },
                            visibility: 'public'
                        },
                        lastActive: new Date(),
                        status: 'active',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                } else {
                    // Update last login and provider info
                    await db.collection('users').updateOne(
                        { email: user.email },
                        {
                            $set: {
                                lastActive: new Date(),
                                updatedAt: new Date(),
                                name: user.name,
                                image: user.image
                            }
                        }
                    );
                }
                return true;
            } catch (error) {
                console.error('Error in signIn callback:', error);
                return true; // Still allow sign in even if our user creation fails
            }
        },
        async jwt({ token, user, account }) {
            if (account && user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error'
    }
});
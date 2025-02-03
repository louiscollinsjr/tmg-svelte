// src/lib/server/auth.ts
import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/core/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient, ObjectId } from 'mongodb';
import { AUTH_GOOGLE_CLIENT_ID, AUTH_GOOGLE_CLIENT_SECRET, AUTH_SECRET, MONGODB_URI, AUTH_APPLE_CLIENT_ID, AUTH_APPLE_CLIENT_SECRET } from "$env/static/private";
import Apple from "@auth/core/providers/apple";
import CredentialsProvider from "@auth/core/providers/credentials";
import type { Provider } from "@auth/core/providers";
import type { CredentialsConfig } from "@auth/core/providers/credentials";
import { verifyPassword } from "./auth-utils"; // Ensure this path matches your actual utils location


const uri = MONGODB_URI;
const client = new MongoClient(uri);

export const authHandler = SvelteKitAuth({
    adapter: MongoDBAdapter(client),
    providers: [
        Google({
          clientId: AUTH_GOOGLE_CLIENT_ID,
          clientSecret: AUTH_GOOGLE_CLIENT_SECRET,
          allowDangerousEmailAccountLinking: true,
          authorization: { 
            params: {
              prompt: "select_account",
              access_type: "offline",
              response_type: "code"
            }
          }
        }),
        Apple({
          clientId: AUTH_APPLE_CLIENT_ID,
          clientSecret: AUTH_APPLE_CLIENT_SECRET
        }),
        CredentialsProvider({
          name: "Email",
          credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials: Partial<Record<'email' | 'password', unknown>>) {
            if (typeof credentials.email !== 'string' || typeof credentials.password !== 'string') {
              return null;
            }
            const db = client.db('tmg-ai-assist-db');
            const user = await db.collection('users').findOne({ email: credentials.email });
            
            if (!user) return null;
            
            const isValid = await verifyPassword(
              credentials.password,
              user.passwordHash
            );
            
            return isValid ? user : null;
          }
        })
      ],
    secret: AUTH_SECRET,
    trustHost: true,
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 hours
        updateAge: 60 * 60, // 1 hour
    },
    events: {
        async signOut({ session, token }) {
            // Ensure token is invalidated
            if (token) {
                token.exp = 0;
            }
        }
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
        async jwt({ token, user, account, trigger }) {
            if (trigger === "signOut") {
                // Return null to invalidate the token completely
                return null;
            }
            
            if (account && user) {
                token.id = user.id;
                token.lastVerified = Date.now();
                // Store provider info
                token.provider = account.provider;
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            if (!token) {
                return null;
            }
            
            if (session.user) {
                session.user.id = token.id as string;
                session.lastVerified = Date.now();
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error'
    }
});
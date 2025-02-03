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
import { User } from './models/User'; // Add User model import

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
                response_type: "code",
                scope: "openid email profile"
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
            const db = client.db('test');
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
            if (account?.provider === 'google') {
              try {
                const db = client.db('test');
                const usersCollection = db.collection('users');
                
                // Check if user exists
                const existingUser = await usersCollection.findOne({ email: profile.email });
                
                if (existingUser) {
                  // Check if Google provider exists
                  const hasGoogleProvider = existingUser.providers?.some(p => p.name === 'google');
                  
                  if (hasGoogleProvider) {
                    // Update existing Google provider's lastLogin
                    await usersCollection.updateOne(
                      { email: profile.email, 'providers.name': 'google' },
                      {
                        $set: {
                          'providers.$.lastLogin': new Date(),
                          'providers.$.providerId': profile.sub,
                          name: profile.name,
                          image: profile.picture,
                          updatedAt: new Date()
                        }
                      }
                    );
                  } else {
                    // Add Google provider to existing user
                    await usersCollection.updateOne(
                      { email: profile.email },
                      {
                        $push: {
                          providers: {
                            name: 'google',
                            providerId: profile.sub,
                            lastLogin: new Date()
                          }
                        },
                        $set: {
                          name: profile.name,
                          image: profile.picture,
                          updatedAt: new Date()
                        }
                      }
                    );
                  }
                } else {
                  // Create new user
                  await usersCollection.insertOne({
                    email: profile.email,
                    name: profile.name,
                    image: profile.picture,
                    providers: [{
                      name: 'google',
                      providerId: profile.sub,
                      lastLogin: new Date()
                    }],
                    isPro: false,
                    status: 'active',
                    preferences: {
                      notifications: {
                        email: true,
                        push: true,
                        marketing: false
                      },
                      visibility: 'public'
                    },
                    createdAt: new Date(),
                    updatedAt: new Date()
                  });
                }
                return true;
              } catch (error) {
                console.error('Google sign-in error:', error);
                return false;
              }
            }
            return true;
        }
    }, 
    pages: {
        signIn: '/login',
        error: '/auth/error'
    }
});
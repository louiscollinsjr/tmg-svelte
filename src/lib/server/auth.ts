// src/lib/server/auth.ts
import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/core/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from 'mongodb';
import { AUTH_GOOGLE_CLIENT_ID, AUTH_GOOGLE_CLIENT_SECRET, AUTH_SECRET, MONGODB_URI, EMAIL_SERVER_HOST, EMAIL_SERVER_PORT, EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD, EMAIL_FROM, AUTH_APPLE_CLIENT_ID, AUTH_APPLE_CLIENT_SECRET } from "$env/static/private";
import Email from "@auth/core/providers/email";
import Apple from "@auth/core/providers/apple";
import CredentialsProvider from "@auth/core/providers/credentials";
import { verifyPassword, hashPassword } from "./auth-utils";
import { getUserModel } from './models/User';

const uri = MONGODB_URI;
const client = new MongoClient(uri);

export const authHandler = SvelteKitAuth({
    adapter: MongoDBAdapter(client),
    providers: [
        Email({
            server: {
                host: EMAIL_SERVER_HOST,
                port: Number(EMAIL_SERVER_PORT),
                auth: {
                    user: EMAIL_SERVER_USER,
                    pass: EMAIL_SERVER_PASSWORD,
                }
            },
            from: EMAIL_FROM,
            maxAge: 24 * 60 * 60, // 24 hours
        }),
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
                password: { label: "Password", type: "password" },
                firstName: { label: "First Name", type: "text" },
                lastName: { label: "Last Name", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                try {
                    const User = getUserModel();
                    // Check if user exists
                    const user = await User.findOne({ email: credentials.email });
                    
                    if (!user) {
                        // Create new user
                        const hashedPassword = await hashPassword(credentials.password);
                        const newUser = await User.create({
                            email: credentials.email,
                            name: `${credentials.firstName} ${credentials.lastName}`,
                            passwordHash: hashedPassword,
                            providers: [],
                            status: 'active'
                        });
                        
                        return {
                            id: newUser._id.toString(),
                            email: newUser.email,
                            name: newUser.name
                        };
                    }

                    // Verify password for existing user
                    const isValid = await verifyPassword(credentials.password, user.passwordHash);
                    if (!isValid) {
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    throw error;
                }
            }
        })
    ],
    secret: AUTH_SECRET,
    trustHost: true,
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: '/login',
        error: '/auth/error',
        verifyRequest: '/auth/verify-request',
    }
});
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
        Google({
            clientId: AUTH_GOOGLE_CLIENT_ID,
            clientSecret: AUTH_GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
            authorization: {
                params: {
                    access_type: "offline",
                    response_type: "code",
                    scope: "openid email profile",
                }
            }
        }),
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
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                
                const user = await getUserModel().findOne({ email: credentials.email });
                if (!user) return null;
                
                const isValid = await verifyPassword(credentials.password, user.password);
                if (!isValid) return null;
                
                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name
                };
            }
        })
    ],
    secret: AUTH_SECRET,
    trustHost: true,
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
    },
    cookies: {
        sessionToken: {
            name: "session-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production"
            }
        }
    }
});
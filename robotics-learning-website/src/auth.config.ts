import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"
import { Provider } from "next-auth/providers";

import { PrismaClient } from "@prisma/client";
import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaAdapter } from "@auth/prisma-adapter";

const connectionString = `${process.env.DATABASE_URL}`

globalThis.pool ??= new Pool({ connectionString })
globalThis.adapter ??= new PrismaNeon(globalThis.pool);
globalThis.prisma ??= new PrismaClient( { adapter: globalThis.adapter });

export const providers: Provider[] = [
  Google({
    profile(profile) {
      return { ...profile, role: typeof profile.role === 'string' ? profile.role : "student", id: profile.id.toString() }
    },
  }),
  GitHub({
    profile(profile) {
      //id, email, name, image
      return { 
        role: typeof profile.role === 'string' ? profile.role : "student", 
        id: profile.id.toString(), email: profile.email, name: profile.name,
        image: profile.avatar_url
      };
    }
  })
]

export default {
  adapter: PrismaAdapter(globalThis.prisma),
  providers,
  redirectProxyUrl: "https://silver-disco-grpxq74jjvr35qq-3000.app.github.dev/auth/",
  basePath: "/auth",
  experimental: {
    enableWebAuthn: false,
  },
  debug: process.env.NODE_ENV !== "production",
  pages: {
    signIn: "/login"
  },
} satisfies NextAuthConfig
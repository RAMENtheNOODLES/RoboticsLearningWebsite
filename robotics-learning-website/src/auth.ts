import NextAuth from "next-auth";
import "next-auth/jwt"
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"

import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const config = {
    adapter: PrismaAdapter(prisma),
    providers: [
        Google,
        GitHub({
          redirectProxyUrl: "https://silver-disco-grpxq74jjvr35qq-3000.app.github.dev/auth/callback/github"
        })
    ],
    basePath: "/auth",
    callbacks: {
        authorized({ request, auth }) {
          console.log(`Request: ${request}`)
          const { pathname } = request.nextUrl
          if (pathname === "/middleware-example") return !!auth
          return true
        },
        jwt({ token, trigger, session, account }) {
          if (trigger === "update") token.name = session.user.name
          if (account?.provider === "keycloak") {
            return { ...token, accessToken: account.access_token }
          }
          return token
        },
        async session({ session, token }) {
          if (token?.accessToken) {
            session.accessToken = token.accessToken
          }
          return session
        },
      },
      experimental: {
        enableWebAuthn: true,
      },
      debug: process.env.NODE_ENV !== "production",
} satisfies NextAuthConfig

export const { handlers, signIn, signOut, auth } = NextAuth(config)

declare module "next-auth" {
  interface Session {
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}
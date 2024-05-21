import NextAuth from "next-auth";
import "next-auth/jwt"
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth"

import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const config = {
    adapter: PrismaAdapter(prisma),
    providers: [
        Google,
    ],
    basePath: "/auth",
    callbacks: {
        authorized({ request, auth }) {
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
      },
      experimental: {
        enableWebAuthn: true,
      },
      debug: process.env.NODE_ENV !== "production" ? true : false,
} satisfies NextAuthConfig

export const { handlers, signIn, signOut, auth } = NextAuth(config)
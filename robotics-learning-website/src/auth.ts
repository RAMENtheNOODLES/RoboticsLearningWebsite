import NextAuth, { NextAuthConfig } from "next-auth";
import "next-auth/jwt"

import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";

globalThis.prisma ??= new PrismaClient();

const config = {
  adapter: PrismaAdapter(globalThis.prisma),
  session: { strategy: "jwt" },
  ...authConfig,
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
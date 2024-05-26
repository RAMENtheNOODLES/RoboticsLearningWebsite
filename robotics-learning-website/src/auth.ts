import NextAuth, { NextAuthConfig } from "next-auth";


import authConfig, { providers } from "./auth.config";

const config = {
  ...authConfig,
  session: { strategy: "database" },
  callbacks: {
    session({ session, user }) {
      session.user.role = user.role;
      return session
    },
    authorized({ request, auth }) {
      console.log(`Request: ${request}`)
      const { pathname } = request.nextUrl
      return true
    },
    redirect({ url, baseUrl }) {
      console.log(`Url: ${url}`);
      if (url.endsWith('/login')) return url.replace(`/login`, `/dashboard`)
      return url;
    }
  },
} satisfies NextAuthConfig


export const { handlers, signIn, signOut, auth, unstable_update: update } = NextAuth(config)

declare module "next-auth" {
  interface User {
    role?: string
  }
}

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider()
    return { id: providerData.id, name: providerData.name}
  } else {
    return { id: provider.id, name: provider.name}
  }
})
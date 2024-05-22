import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"

export default {
    providers: [
        Google,
        GitHub({
          redirectProxyUrl: "https://silver-disco-grpxq74jjvr35qq-3000.app.github.dev/auth/"
        })
    ],
    basePath: "/auth",
    callbacks: {
        authorized({ request, auth }) {
          console.log(`Request: ${request}`)
          const { pathname } = request.nextUrl
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
        enableWebAuthn: false,
      },
      debug: process.env.NODE_ENV !== "production",
} satisfies NextAuthConfig
import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import Github from "next-auth/providers/github";

import {
  isOrgAdmin,
  isTokenExpired,
  TOKEN_MAX_AGE,
  TOKEN_UPDATE_AGE,
} from "@/lib/github";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: TOKEN_MAX_AGE,
    updateAge: TOKEN_UPDATE_AGE,
  },

  providers: [
    Github({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "read:org",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ account }) {
      return isOrgAdmin(account?.access_token);
    },

    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.lastTokenCheck = Date.now();

        return token;
      }

      if (token.accessToken && isTokenExpired(token)) {
        const isAdmin = await isOrgAdmin(token.accessToken);

        if (!isAdmin) return {};

        token.lastTokenCheck = Date.now();
      }

      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

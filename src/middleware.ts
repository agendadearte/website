import { withAuth } from "next-auth/middleware";
import { isOrgAdmin, isTokenExpired } from "@/lib/github";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: async ({ token }) => {
      if (!token) return false;

      if (isTokenExpired(token)) {
        const isAdmin = await isOrgAdmin(token?.accessToken);

        if (!isAdmin) return false;

        token.lastTokenCheck = Date.now();
        return true;
      }

      return true;
    },
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};

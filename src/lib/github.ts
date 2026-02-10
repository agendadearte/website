import type { JWT } from "next-auth/jwt";

const ALLOWED_ORG_ROLES = ["admin", "owner"];
const GITHUB_ORG = "agendadearte";

export const TOKEN_MAX_AGE = 10 * 60; // 10 minutes
export const TOKEN_UPDATE_AGE = 5 * 60; // 5 minutes
export const TOKEN_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const isOrgAdmin = async (accessToken: string | undefined) => {
  if (!accessToken) return false;

  const res = await fetch(
    `https://api.github.com/user/memberships/orgs/${GITHUB_ORG}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (!res.ok) return false;

  const membership = await res.json();

  return (
    membership.state === "active" && ALLOWED_ORG_ROLES.includes(membership.role)
  );
};

export const isTokenExpired = (token: JWT) => {
  return (
    token?.lastTokenCheck == null ||
    Date.now() - token.lastTokenCheck > TOKEN_INTERVAL
  );
};

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { LogOut } from "./components/LogOut";

const PAGE_TITLE = "Panel de control";

export const metadata: Metadata = { title: PAGE_TITLE };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  return (
    <article>
      <header>
        <h1>{PAGE_TITLE}</h1>
      </header>
      <section>
        <p>
          <code>Loged user: {session.user?.name}</code>
        </p>
        <LogOut />
      </section>
    </article>
  );
}

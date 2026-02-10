import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { LogOut } from "./components/LogOut";

export const metadata: Metadata = {
  title: "Agenda de Arte - Panel de control",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  return (
    <>
      <title>Agenda de Arte - Dashboard</title>
      <article>
        <header>
          <h1>Dashboard</h1>
        </header>
        <section>
          <p>
            <code>Loged user: {session.user?.name}</code>
          </p>
          <LogOut />
        </section>
      </article>
    </>
  );
}

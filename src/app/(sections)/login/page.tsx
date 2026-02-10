import type { Metadata } from "next";
import { getServerSession } from "next-auth";

import { LogIn } from "./components/LogIn";

export const metadata: Metadata = {
  title: "Agenda de Arte - Registro",
};

export default async function LoginPage({ searchParams }) {
  const { error } = await searchParams;

  return (
    <>
      <title>Agenda de Arte - Login</title>
      <article>
        <header>
          <h1>Login</h1>
        </header>
        <section>
          <h2>{error}</h2>
          <LogIn />
        </section>
      </article>
    </>
  );
}

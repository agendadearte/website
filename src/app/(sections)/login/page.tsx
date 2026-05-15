import type { Metadata } from "next";

import { LogIn } from "./components/LogIn";

const PAGE_TITLE = "Registro";

export const metadata: Metadata = { title: PAGE_TITLE };

export default async function LoginPage({ searchParams }) {
  const { error } = await searchParams;

  return (
    <article>
      <header>
        <h1>{PAGE_TITLE}</h1>
      </header>
      <section>
        <h2>{error}</h2>
        <LogIn />
      </section>
    </article>
  );
}

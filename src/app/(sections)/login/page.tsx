import type { Metadata } from "next";

import { LogIn } from "./components/LogIn";

const PAGE_TITLE = "Registro";

export const metadata: Metadata = { title: PAGE_TITLE };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <article className="page-content">
      <header className="page-header">
        <h1 className="page-title">{PAGE_TITLE}</h1>
      </header>
      <section>
        {error && <h2>{error}</h2>}
        <LogIn />
      </section>
    </article>
  );
}

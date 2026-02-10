import Link from "next/link";
import Image from "next/image";
import type { Metadata, Viewport } from "next";
import { getStyles } from "typestyle";
import { AppBar, Container } from "@agendadearte/sketchbox";

import "./global.scss";
import styles from "./layout.module.scss";

export const metadata: Metadata = {
  title: "Agenda de Arte",
  description: "Agenda de arte de la Comunidad de Madrid",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 2,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title></title>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
          rel="stylesheet"
        />
        <style>{getStyles()}</style>
      </head>
      <body>
        <div className={styles.header}>
          <AppBar>
            <Link href="/" className={styles.logo}>
              <Image
                alt="Logo Agenda de Arte"
                src="/images/logo-header.svg"
                width={28.8}
                height={28.8}
              />
              Agenda de Arte
            </Link>
          </AppBar>
          <nav className={styles.navigation__container}>
            <Container>
              <div className={styles.navigation__items}>
                <Link className={styles.navigation__item} href="/">
                  Eventos
                </Link>
                <Link className={styles.navigation__item} href="/lugares">
                  Lugares
                </Link>
                <a
                  href="mailto:info@agendadearte.com"
                  className={styles.navigation__item}
                >
                  info@agendadearte.com
                </a>
              </div>
            </Container>
          </nav>
        </div>
        <Container element="main" id="root">
          {children}
        </Container>
      </body>
    </html>
  );
}

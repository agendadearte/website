import Link from "next/link";
import Image from "next/image";
import type { Metadata, Viewport } from "next";
import { getStyles } from "typestyle";
import { AppBar, Container } from "@agendadearte/sketchbox";

import "./variables.scss";
import "./layout.scss";

export const metadata: Metadata = {
  title: {
    default: "Agenda de Arte",
    template: "%s | Agenda de Arte",
  },
  description: "Agenda de arte de la Comunidad de Madrid",
  metadataBase: new URL("https://agendadearte.com"),
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
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
          rel="stylesheet"
        />
        <style>{getStyles()}</style>
      </head>
      <body>
        <div className="main-header">
          <AppBar>
            <Link href="/" className="app-logo">
              <Image
                alt="Logo Agenda de Arte"
                src="/images/logo-header.svg"
                width={28.8}
                height={28.8}
              />
              Agenda de Arte
            </Link>
          </AppBar>
          <nav className="navigation__container">
            <Container>
              <div className="navigation__items">
                <Link className="navigation__item" href="/">
                  Eventos
                </Link>
                <Link className="navigation__item" href="/lugares">
                  Lugares
                </Link>
                <a
                  href="mailto:info@agendadearte.com"
                  className="navigation__item"
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

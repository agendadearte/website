"use client";

import { SessionProvider } from "next-auth/react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider refetchInterval={60} refetchOnWindowFocus>
      {children}
    </SessionProvider>
  );
}

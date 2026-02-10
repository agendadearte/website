"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components";

export const LogOut = () => {
  return (
    <Button onClick={() => signOut({ callbackUrl: "/" })} text="Sign Out" />
  );
};

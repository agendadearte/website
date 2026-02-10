"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components";

export const LogIn = () => {
  return (
    <Button
      onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
      text="Signin with GitHub"
    />
  );
};

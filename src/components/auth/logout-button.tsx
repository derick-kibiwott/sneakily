"use client";

import { logoutAction } from "@/actions/auth/logout";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <Button
      variant={"secondary"}
      className={"cursor-pointer"}
      onClick={handleLogout}
    >
      Logout
      <LogOut />
    </Button>
  );
}

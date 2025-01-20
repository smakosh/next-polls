"use client";

import { useActionState } from "react";
import { LogOutIcon } from "lucide-react";

import { logout } from "@/app/(auth)/_lib/actions";

export default function LogoutButton() {
  const [_state, action, isPending] = useActionState(logout, undefined);
  return (
    <form action={action}>
      <button
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-all hover:text-gray-900"
        aria-disabled={isPending}
      >
        <LogOutIcon className="size-4" />
        Logout
      </button>
    </form>
  );
}

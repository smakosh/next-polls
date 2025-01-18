"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/app/(auth)/_lib/actions";

export function LoginForm() {
  const [state, action, isPending] = useActionState(login, undefined);

  return (
    <form action={action}>
      <div className="flex flex-col gap-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="m@example.com"
            type="email"
          />
          {state?.errors?.email && (
            <p className="text-sm text-red-500">{state.errors.email}</p>
          )}
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link className="text-sm underline" href="#">
              Forgot your password?
            </Link>
          </div>
          <Input id="password" type="password" name="password" />
          {state?.errors?.password && (
            <p className="text-sm text-red-500">{state.errors.password}</p>
          )}
        </div>
        {state?.message && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}
        <Button aria-disabled={isPending} type="submit" className="mt-4 w-full">
          {isPending ? "Submitting..." : "Sign in"}
        </Button>
      </div>
    </form>
  );
}

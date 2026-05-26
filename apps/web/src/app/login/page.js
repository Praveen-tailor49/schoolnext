"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import AuthShell from "@/components/auth/auth-shell";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const { login, loading, authError } = useAuthStore();
  const [values, setValues] = useState({ email: "", password: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await login(values);
    router.replace(next);
  };

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to manage your school operations."
      footer={
        <span>
          New here?{" "}
          <Link className="font-semibold text-primary hover:underline" href="/register">
            Create an account
          </Link>
          {" · "}
          <Link className="font-semibold text-primary hover:underline" href="/forgot-password">
            Forgot password
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Email
          </p>
          <Input
            type="email"
            required
            value={values.email}
            onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="admin@learnnext.com"
          />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Password
          </p>
          <Input
            type="password"
            required
            value={values.password}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, password: event.target.value }))
            }
            placeholder="Your password"
          />
        </div>
        {authError ? (
          <div className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {authError}
          </div>
        ) : null}
        <Button className="w-full" size="lg" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}


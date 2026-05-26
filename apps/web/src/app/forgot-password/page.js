"use client";

import Link from "next/link";
import { useState } from "react";
import AuthShell from "@/components/auth/auth-shell";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const { forgotPassword, loading, authError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [resetUrl, setResetUrl] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await forgotPassword({ email });
    setResetUrl(response.resetUrl);
  };

  return (
    <AuthShell
      title="Reset password"
      description="Generate a reset link for this MVP (shows the URL directly)."
      footer={
        <span>
          Remembered it?{" "}
          <Link className="font-semibold text-primary hover:underline" href="/login">
            Back to sign in
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
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@learnnext.com"
          />
        </div>
        {authError ? (
          <div className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {authError}
          </div>
        ) : null}
        {resetUrl ? (
          <div className="rounded-2xl border border-border bg-secondary/50 px-4 py-3 text-sm">
            <p className="font-semibold">Reset link:</p>
            <a
              className="break-all text-primary hover:underline"
              href={resetUrl}
            >
              {resetUrl}
            </a>
          </div>
        ) : null}
        <Button className="w-full" size="lg" type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate reset link"}
        </Button>
      </form>
    </AuthShell>
  );
}

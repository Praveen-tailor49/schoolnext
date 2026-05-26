"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import AuthShell from "@/components/auth/auth-shell";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const { resetPassword, loading, authError } = useAuthStore();
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    await resetPassword(params.token, { password });
    router.replace("/dashboard");
  };

  return (
    <AuthShell
      title="Set new password"
      description="Choose a new password to continue."
      footer={
        <span>
          Want to sign in instead?{" "}
          <Link className="font-semibold text-primary hover:underline" href="/login">
            Back to sign in
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            New password
          </p>
          <Input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimum 6 characters"
          />
        </div>
        {authError ? (
          <div className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {authError}
          </div>
        ) : null}
        <Button className="w-full" size="lg" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Update password"}
        </Button>
      </form>
    </AuthShell>
  );
}

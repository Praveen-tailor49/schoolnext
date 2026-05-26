"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthShell from "@/components/auth/auth-shell";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ROLES } from "@/lib/roles";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, authError } = useAuthStore();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    role: ROLES.TEACHER,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await register(values);
    router.replace("/dashboard");
  };

  return (
    <AuthShell
      title="Create account"
      description="Start with an admin or teacher account for the MVP."
      footer={
        <span>
          Already have an account?{" "}
          <Link className="font-semibold text-primary hover:underline" href="/login">
            Sign in
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Name
          </p>
          <Input
            required
            value={values.name}
            onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Your name"
          />
        </div>
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
            Role
          </p>
          <Select
            value={values.role}
            onChange={(event) => setValues((prev) => ({ ...prev, role: event.target.value }))}
          >
            <option value={ROLES.TEACHER}>Teacher</option>
            <option value={ROLES.PARENT}>Parent</option>
            <option value={ROLES.STUDENT}>Student</option>
          </Select>
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
            placeholder="Minimum 6 characters"
          />
        </div>
        {authError ? (
          <div className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {authError}
          </div>
        ) : null}
        <Button className="w-full" size="lg" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}

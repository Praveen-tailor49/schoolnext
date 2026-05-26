"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, isHydrated, fetchProfile, user } = useAuthStore();
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!token) {
      setProfileChecked(true);
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user) {
      setProfileChecked(true);
      return;
    }

    let active = true;

    fetchProfile().finally(() => {
      if (active) {
        setProfileChecked(true);
      }
    });

    return () => {
      active = false;
    };
  }, [fetchProfile, isHydrated, pathname, router, token, user]);

  if (!isHydrated || !token || !profileChecked || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
          Loading secure workspace...
        </div>
      </div>
    );
  }

  return children;
}

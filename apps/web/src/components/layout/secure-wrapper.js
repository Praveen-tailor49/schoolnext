"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import DashboardShell from "@/components/layout/dashboard-shell";

export default function SecureWrapper({ children }) {
  return (
    <ProtectedRoute>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoute>
  );
}


"use client";

import ResourcePage from "@/components/resources/resource-page";

export default function SuperAdminPage() {
  return (
    <div className="space-y-6">
      <div className="animate-enter flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Super Admin SaaS Panel</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage registered schools, subscriptions, and global settings.
          </p>
        </div>
      </div>

      <ResourcePage moduleKey="schools" />
    </div>
  );
}

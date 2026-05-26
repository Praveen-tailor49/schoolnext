"use client";

import SecureWrapper from "@/components/layout/secure-wrapper";
import ResourcePage from "@/components/resources/resource-page";

export default function StaffLeavesPage() {
  return (
    <SecureWrapper>
      <ResourcePage moduleKey="staff-leaves" />
    </SecureWrapper>
  );
}

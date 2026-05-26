"use client";

import SecureWrapper from "@/components/layout/secure-wrapper";
import ResourcePage from "@/components/resources/resource-page";

export default function AllocationsPage() {
  return (
    <SecureWrapper>
      <ResourcePage moduleKey="transport-allocations" />
    </SecureWrapper>
  );
}

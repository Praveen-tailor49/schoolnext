"use client";

import SecureWrapper from "@/components/layout/secure-wrapper";
import ResourcePage from "@/components/resources/resource-page";

export default function VehiclesPage() {
  return (
    <SecureWrapper>
      <ResourcePage moduleKey="vehicles" />
    </SecureWrapper>
  );
}

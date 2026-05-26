"use client";

import SecureWrapper from "@/components/layout/secure-wrapper";
import ResourcePage from "@/components/resources/resource-page";

export default function ApplicationsPage() {
  return (
    <SecureWrapper>
      <ResourcePage moduleKey="applications" />
    </SecureWrapper>
  );
}

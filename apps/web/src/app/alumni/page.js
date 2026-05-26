"use client";

import SecureWrapper from "@/components/layout/secure-wrapper";
import ResourcePage from "@/components/resources/resource-page";

export default function AlumniPage() {
  return (
    <SecureWrapper>
      <ResourcePage moduleKey="alumni" />
    </SecureWrapper>
  );
}

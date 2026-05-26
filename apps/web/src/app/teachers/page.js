"use client";

import SecureWrapper from "@/components/layout/secure-wrapper";
import ResourcePage from "@/components/resources/resource-page";

export default function TeachersPage() {
  return (
    <SecureWrapper>
      <ResourcePage moduleKey="teachers" />
    </SecureWrapper>
  );
}


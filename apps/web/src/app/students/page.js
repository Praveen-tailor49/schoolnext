"use client";

import SecureWrapper from "@/components/layout/secure-wrapper";
import ResourcePage from "@/components/resources/resource-page";

export default function StudentsPage() {
  return (
    <SecureWrapper>
      <ResourcePage moduleKey="students" />
    </SecureWrapper>
  );
}


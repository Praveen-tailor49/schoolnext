"use client";

import SecureWrapper from "@/components/layout/secure-wrapper";
import ResourcePage from "@/components/resources/resource-page";

export default function ExamsPage() {
  return (
    <SecureWrapper>
      <ResourcePage moduleKey="exams" />
    </SecureWrapper>
  );
}


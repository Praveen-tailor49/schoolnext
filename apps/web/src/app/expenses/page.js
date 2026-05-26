"use client";

import SecureWrapper from "@/components/layout/secure-wrapper";
import ResourcePage from "@/components/resources/resource-page";

export default function ExpensesPage() {
  return (
    <SecureWrapper>
      <ResourcePage moduleKey="expenses" />
    </SecureWrapper>
  );
}

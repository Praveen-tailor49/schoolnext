"use client";

import SecureWrapper from "@/components/layout/secure-wrapper";
import ResourcePage from "@/components/resources/resource-page";

export default function ExpenseCategoriesPage() {
  return (
    <SecureWrapper>
      <ResourcePage moduleKey="expense-categories" />
    </SecureWrapper>
  );
}

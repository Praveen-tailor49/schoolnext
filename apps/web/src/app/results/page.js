"use client";

import SecureWrapper from "@/components/layout/secure-wrapper";
import ResourcePage from "@/components/resources/resource-page";

export default function ResultsPage() {
  return (
    <SecureWrapper>
      <ResourcePage moduleKey="results" />
    </SecureWrapper>
  );
}


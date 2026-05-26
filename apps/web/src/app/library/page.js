"use client";

import SecureWrapper from "@/components/layout/secure-wrapper";
import ResourcePage from "@/components/resources/resource-page";

export default function LibraryPage() {
  return (
    <SecureWrapper>
      <ResourcePage moduleKey="library" />
    </SecureWrapper>
  );
}


"use client";

import SecureWrapper from "@/components/layout/secure-wrapper";
import ResourcePage from "@/components/resources/resource-page";

export default function RoomsPage() {
  return (
    <SecureWrapper>
      <ResourcePage moduleKey="hostel-rooms" />
    </SecureWrapper>
  );
}

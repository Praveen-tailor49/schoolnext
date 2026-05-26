"use client";

import SecureWrapper from "@/components/layout/secure-wrapper";
import ResourcePage from "@/components/resources/resource-page";

export default function TimetablePage() {
  return (
    <SecureWrapper>
      <ResourcePage moduleKey="timetable" />
    </SecureWrapper>
  );
}


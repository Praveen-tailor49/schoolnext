"use client";

import SecureWrapper from "@/components/layout/secure-wrapper";
import ResourcePage from "@/components/resources/resource-page";

export default function StaffAttendancePage() {
  return (
    <SecureWrapper>
      <ResourcePage moduleKey="staff-attendance" />
    </SecureWrapper>
  );
}

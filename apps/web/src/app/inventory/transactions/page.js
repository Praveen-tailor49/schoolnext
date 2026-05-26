"use client";

import SecureWrapper from "@/components/layout/secure-wrapper";
import ResourcePage from "@/components/resources/resource-page";

export default function InventoryTransactionsPage() {
  return (
    <SecureWrapper>
      <ResourcePage moduleKey="inventory-transactions" />
    </SecureWrapper>
  );
}

"use client";

import { useState } from "react";
import SecureWrapper from "@/components/layout/secure-wrapper";
import { CreditCard, LayoutDashboard, Settings2, ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";

import OverviewTab from "@/components/fees/overview-tab";
import StructuresTab from "@/components/fees/structures-tab";
import DuesTab from "@/components/fees/dues-tab";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "dues", label: "Student Dues & Payments", icon: CreditCard },
  { id: "structures", label: "Fee Structures", icon: Settings2 },
  { id: "reports", label: "Reports & Receipts", icon: ReceiptText },
];

export default function FeesPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <SecureWrapper>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Fees Management</h1>
            <p className="text-slate-500 mt-1">Manage fee structures, collect payments, and track revenue.</p>
          </div>
        </div>

        <div className="border-b border-border">
          <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2 transition-colors",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:border-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-2">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "structures" && <StructuresTab />}
          {activeTab === "dues" && <DuesTab />}
          {activeTab === "reports" && (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <ReceiptText className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Reports Module</h3>
              <p className="mt-2 text-slate-500">Coming soon in next update phase.</p>
            </div>
          )}
        </div>
      </div>
    </SecureWrapper>
  );
}

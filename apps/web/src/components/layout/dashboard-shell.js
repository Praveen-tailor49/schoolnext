"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import { navigationItems } from "@/lib/navigation";
import { useAuthStore } from "@/store/auth-store";

const findTitle = (pathname, role) => {
  const match = navigationItems.find((item) => item.href === pathname);
  if (!match) {
    return { title: "LearnNext ERP", subtitle: role ? `Role: ${role}` : "" };
  }
  return { title: match.label, subtitle: match.roles?.includes(role) ? `Role: ${role}` : "" };
};

export default function DashboardShell({ children, onSearch, searchValue }) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const role = user?.role;
  const { title, subtitle } = findTitle(pathname, role);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden h-screen lg:fixed lg:inset-y-0 lg:flex">
        <Sidebar collapsed={collapsed} onNavigate={() => null} />
      </div>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative h-full">
            <Sidebar collapsed={false} onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className={collapsed ? "lg:pl-[84px]" : "lg:pl-[280px]"}>
        <Topbar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setMobileNavOpen(true)}
          onSearch={onSearch}
          searchValue={searchValue}
        />

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              className="hidden rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground shadow-panel transition hover:bg-secondary lg:inline-flex"
              onClick={() => setCollapsed((value) => !value)}
            >
              {collapsed ? "Expand sidebar" : "Collapse sidebar"}
            </button>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { GraduationCap, LogOut } from "lucide-react";
import { navigationItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

export default function Sidebar({ collapsed, onNavigate }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, logout } = useAuthStore();

  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, searchParams]);

  const handleNavClick = (e, href) => {
    if (pathname === href) return;
    setIsNavigating(true);
    if (onNavigate) onNavigate();
  };

  const role = user?.role;
  const visibleItems = navigationItems.filter((item) =>
    role ? item.roles.includes(role) : false
  );

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border/70 bg-card/70 backdrop-blur",
        collapsed ? "w-[84px]" : "w-[280px]"
      )}
    >
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          <GraduationCap className="h-5 w-5" />
        </div>
        {collapsed ? null : (
          <div className="min-w-0">
            <p className="font-heading text-lg font-semibold leading-tight">
              LearnNext ERP
            </p>
            <p className="truncate text-xs text-muted-foreground">
              School management
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 overflow-y-auto pb-4">
        {visibleItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-primary text-primary-foreground shadow-panel"
                  : "text-foreground hover:bg-secondary"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {collapsed ? null : (
                <span className="truncate">{label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/70 px-4 py-4">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="h-10 w-10 shrink-0 rounded-2xl bg-secondary text-secondary-foreground grid place-items-center font-heading text-sm font-semibold">
            {(user?.name || "User")
              .split(" ")
              .map((part) => part[0])
              .filter(Boolean)
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          {collapsed ? null : (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {user?.name || "User"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email || "-"}
              </p>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          className={cn(
            "mt-3 w-full justify-start rounded-2xl",
            collapsed && "justify-center px-0"
          )}
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          {collapsed ? null : "Logout"}
        </Button>
      </div>

      {isNavigating && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] cursor-wait">
          <div className="flex items-center gap-3 bg-white/90 px-5 py-3 rounded-2xl shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="h-5 w-5 animate-spin rounded-full border-[3px] border-primary border-t-transparent"></div>
            {/* <span className="font-semibold text-slate-700 text-sm tracking-wide">Loading module...</span> */}
          </div>
        </div>,
        document.body
      )}
    </aside>
  );
}


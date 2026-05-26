"use client";

import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Input } from "@/components/ui/input";

export default function Topbar({ onMenuClick, title, subtitle, onSearch, searchValue }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/70 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <div className="min-w-0 flex-1">
          <p className="truncate font-heading text-xl font-semibold">{title}</p>
          {subtitle ? (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>

        {onSearch ? (
          <div className="hidden w-[320px] items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 shadow-panel sm:flex">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search..."
              className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
          </div>
        ) : null}

        <ThemeToggle />
      </div>
    </header>
  );
}


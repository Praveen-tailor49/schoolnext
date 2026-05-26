"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useState } from "react";
import PromoteModal from "./promote-modal";
import { DownloadCloud, FileText } from "lucide-react";

export default function ResourceToolbar({
  searchValue,
  searchPlaceholder,
  onSearchChange,
  filters,
  activeFilters,
  onFilterChange,
  canCreate,
  onCreate,
  moduleKey,
  onExportCSV,
  onExportPDF,
}) {
  const [promoteModalOpen, setPromoteModalOpen] = useState(false);

  return (
    <>
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/80 p-4 shadow-panel backdrop-blur sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Search
          </p>
          <Input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder || "Search..."}
          />
        </div>

        {filters?.length ? (
          <div className="grid flex-1 gap-3 sm:grid-cols-2">
            {filters.map((filter) => (
              <div key={filter.name} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {filter.label}
                </p>
                <Select
                  value={activeFilters[filter.name] || "all"}
                  onChange={(event) => onFilterChange(filter.name, event.target.value)}
                >
                  {(filter.options || []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-3 sm:ml-4">
        {onExportCSV && (
          <Button variant="outline" size="icon" onClick={onExportCSV} title="Export CSV">
            <DownloadCloud className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
        {onExportPDF && (
          <Button variant="outline" size="icon" onClick={onExportPDF} title="Export PDF">
            <FileText className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
        
        {moduleKey === "students" && canCreate && (
          <Button variant="secondary" onClick={() => setPromoteModalOpen(true)}>
            Promote Students
          </Button>
        )}
        {canCreate ? (
          <Button onClick={onCreate}>
            Add new
          </Button>
        ) : null}
      </div>
    </div>
    {promoteModalOpen && <PromoteModal onClose={() => setPromoteModalOpen(false)} />}
    </>
  );
}


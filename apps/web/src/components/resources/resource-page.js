"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { canPerformAction, getModuleConfig } from "@/lib/modules";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResourceToolbar from "./resource-toolbar";
import ResourceTable from "./resource-table";
import Pagination from "./pagination";
import ResourceDrawer from "./resource-drawer";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { exportToCSV, exportToPDF } from "@/lib/exportUtils";

const buildParams = ({ page, limit, search, filters }) => {
  const params = { page, limit };
  if (search?.trim()) params.q = search.trim();

  Object.entries(filters || {}).forEach(([key, value]) => {
    if (!value || value === "all") return;
    params[key] = value;
  });

  return params;
};

export default function ResourcePage({ moduleKey }) {
  const config = useMemo(() => getModuleConfig(moduleKey), [moduleKey]);
  const { user } = useAuthStore();
  const role = user?.role;

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState({});

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletePending, setDeletePending] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const canCreate = config ? canPerformAction(config, "create", role) : false;
  const canEdit = config ? canPerformAction(config, "update", role) : false;
  const canDelete = config ? canPerformAction(config, "delete", role) : false;
  const isUnauthorized = Boolean(config && role && !config.roles.includes(role));

  const params = useMemo(
    () => buildParams({ page, limit, search: debouncedSearch, filters }),
    [filters, limit, page, debouncedSearch]
  );

  useEffect(() => {
    if (!config || isUnauthorized) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    api
      .get(config.endpoint, { params })
      .then((response) => {
        if (!active) return;
        setItems(response.data.items || []);
        setPagination(response.data.pagination);
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.message || "Failed to load records.");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [config, isUnauthorized, params]);

  if (!config) {
    return (
      <div className="rounded-2xl border border-border bg-card/80 px-6 py-5 shadow-panel">
        <p className="font-heading text-xl font-semibold">Module not found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          This module key is not configured: <span className="font-mono">{moduleKey}</span>
        </p>
        <div className="mt-4">
          <Link className="text-sm font-semibold text-primary hover:underline" href="/dashboard">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (isUnauthorized) {
    return (
      <div className="rounded-2xl border border-danger/30 bg-danger/10 px-6 py-5 text-danger shadow-panel">
        <p className="font-heading text-xl font-semibold">Access denied</p>
        <p className="mt-2 text-sm">
          Your role (<span className="font-mono">{role}</span>) cannot access{" "}
          <span className="font-semibold">{config.title}</span>.
        </p>
        <div className="mt-4">
          <Link className="text-sm font-semibold text-danger hover:underline" href="/dashboard">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleFilterChange = (name, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (value) => {
    setPage(1);
    setSearch(value);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setDrawerOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setDrawerOpen(true);
  };

  const handleDelete = async (item) => {
    if (deletePending?.id === item.id) {
      return;
    }

    setDeletePending(item);

    const confirmed = window.confirm(
      `Delete this record?\n\n${item.id}\n\nThis cannot be undone.`
    );

    if (!confirmed) {
      setDeletePending(null);
      return;
    }

    try {
      await api.delete(`${config.endpoint}/${item.id}`);
      setItems((prev) => prev.filter((entry) => entry.id !== item.id));
    } catch (err) {
      window.alert(err?.message || "Failed to delete record.");
    } finally {
      setDeletePending(null);
    }
  };

  const handleSaved = () => {
    api
      .get(config.endpoint, { params })
      .then((response) => {
        setItems(response.data.items || []);
        setPagination(response.data.pagination);
      })
      .catch(() => null);
  };

  const handleExportCSV = () => {
    exportToCSV(items, config.columns || [], `${config.key}-export.csv`);
  };

  const handleExportPDF = () => {
    exportToPDF(items, config.columns || [], config.title, `${config.key}-export.pdf`);
  };

  return (
    <div className="space-y-6">
      <Card className="animate-enter">
        <CardHeader>
          <CardTitle>{config.title}</CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <ResourceToolbar
            moduleKey={moduleKey}
            searchValue={search}
            searchPlaceholder={config.searchPlaceholder}
            onSearchChange={handleSearchChange}
            filters={config.filters}
            activeFilters={filters}
            onFilterChange={handleFilterChange}
            canCreate={canCreate}
            onCreate={handleCreate}
            onExportCSV={items.length ? handleExportCSV : undefined}
            onExportPDF={items.length ? handleExportPDF : undefined}
          />

          {error ? (
            <div className="rounded-2xl border border-danger/30 bg-danger/10 px-5 py-4 text-danger">
              {error}
            </div>
          ) : null}

          <div className="rounded-2xl border border-border bg-card/60 shadow-panel overflow-hidden">
            {loading ? (
              <TableSkeleton columns={config.columns?.length || 5} rows={5} />
            ) : (
              <ResourceTable
                config={config}
                items={items}
                canEdit={canEdit}
                canDelete={canDelete}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deletingId={deletePending?.id}
              />
            )}
          </div>

          <Pagination pagination={pagination} onPageChange={setPage} />
        </CardContent>
      </Card>

      <ResourceDrawer
        open={drawerOpen}
        title={config.title}
        config={config}
        editingItem={editingItem}
        onClose={() => setDrawerOpen(false)}
        onSaved={handleSaved}
      />
    </div>
  );
}

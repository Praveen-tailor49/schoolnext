"use client";

import { useMemo } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, getValueByPath, truncate } from "@/lib/utils";

const getBadgeVariant = (value) => {
  const text = String(value || "").toLowerCase();

  if (["paid", "present", "completed", "active", "available", "sent", "published"].includes(text)) {
    return "success";
  }

  if (["partial", "late", "pending", "limited", "draft"].includes(text)) {
    return "warning";
  }

  if (["unpaid", "overdue", "absent", "inactive", "failed", "out-of-stock", "closed"].includes(text)) {
    return "danger";
  }

  return "default";
};

export default function ResourceTable({
  config,
  items,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
  deletingId,
}) {
  const columns = config.columns || [];

  const resolvedColumns = useMemo(
    () =>
      columns.map((column) => ({
        ...column,
        key: column.key,
      })),
    [columns]
  );

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          {resolvedColumns.map((column) => (
            <TableHead key={column.key}>{column.label}</TableHead>
          ))}
          {(canEdit || canDelete) ? <TableHead className="text-right">Actions</TableHead> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length ? (
          items.map((item) => (
            <TableRow key={item.id}>
              {resolvedColumns.map((column) => {
                let value = column.key.includes(".")
                  ? getValueByPath(item, column.key)
                  : item[column.key];

                if (column.render) {
                  value = column.render(item);
                } else if (column.type === "date") {
                  value = formatDate(value);
                } else if (typeof value === "string") {
                  value = truncate(value, 50);
                }

                return (
                  <TableCell key={`${item.id}-${column.key}`}>
                    {column.badge ? (
                      <Badge variant={getBadgeVariant(value)}>{value || "-"}</Badge>
                    ) : (
                      value ?? "-"
                    )}
                  </TableCell>
                );
              })}
              {(canEdit || canDelete) ? (
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-2">
                    {canEdit ? (
                      <Button
                        size="icon"
                        variant="outline"
                        aria-label="Edit"
                        onClick={() => onEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    ) : null}
                    {canDelete ? (
                      <Button
                        size="icon"
                        variant="danger"
                        aria-label="Delete"
                        disabled={deletingId === item.id}
                        onClick={() => onDelete(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              ) : null}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={resolvedColumns.length + 1}>
              <div className="py-10 text-center text-sm text-muted-foreground">
                No records found.
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

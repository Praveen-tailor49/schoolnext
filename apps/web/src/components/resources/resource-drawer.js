"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import api from "@/lib/api";
import { cn, toInputDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

const parseJsonField = (value, fallback) => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const normalizeFormValues = (fields, item) => {
  const initial = {};

  fields.forEach((field) => {
    const value = item?.[field.name];

    if (field.type === "select" && field.source) {
      if (value && typeof value === "object") {
        initial[field.name] = value[field.source.valueKey] || value.id || "";
      } else {
        initial[field.name] = value ?? "";
      }
      return;
    }

    if (field.type === "date") {
      initial[field.name] = toInputDate(value);
      return;
    }

    if (field.type === "checkbox") {
      initial[field.name] = Boolean(value);
      return;
    }

    if (field.type === "json") {
      initial[field.name] = value ? JSON.stringify(value, null, 2) : "";
      return;
    }

    initial[field.name] = value ?? "";
  });

  return initial;
};

const buildPayload = (fields, values) => {
  const payload = {};

  fields.forEach((field) => {
    const rawValue = values[field.name];

    if (field.type === "number") {
      payload[field.name] = rawValue === "" ? undefined : Number(rawValue);
      return;
    }

    if (field.type === "date") {
      payload[field.name] = rawValue ? new Date(rawValue).toISOString() : undefined;
      return;
    }

    if (field.type === "checkbox") {
      payload[field.name] = Boolean(rawValue);
      return;
    }

    if (field.type === "json") {
      payload[field.name] = parseJsonField(rawValue, []);
      return;
    }

    payload[field.name] = rawValue === "" ? undefined : rawValue;
  });

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });

  return payload;
};

const fetchOptions = async (source, query = "") => {
  const response = await api.get(source.endpoint, { params: { q: query, limit: 50 } });
  return response.data.items || [];
};

export default function ResourceDrawer({
  open,
  title,
  config,
  editingItem,
  onClose,
  onSaved,
}) {
  const fields = config.fields || [];
  const mode = editingItem?.id ? "edit" : "create";
  const [values, setValues] = useState(() => normalizeFormValues(fields, editingItem));
  const [loading, setLoading] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState({});

  const selectFields = useMemo(
    () => fields.filter((field) => field.type === "select" && field.source),
    [fields]
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues(normalizeFormValues(fields, editingItem));
    setError(null);
  }, [editingItem, fields, open]);

  useEffect(() => {
    if (!open || !selectFields.length) {
      return;
    }

    let active = true;

    Promise.all(
      selectFields.map(async (field) => {
        const items = await fetchOptions(field.source);
        return { name: field.name, items };
      })
    )
      .then((entries) => {
        if (!active) return;
        const nextOptions = {};
        entries.forEach(({ name, items }) => {
          nextOptions[name] = items;
        });
        setOptions(nextOptions);
      })
      .catch(() => {
        if (!active) return;
        setOptions({});
      });

    return () => {
      active = false;
    };
  }, [open, selectFields]);

  if (!open) {
    return null;
  }

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (name, file) => {
    if (!file) return;
    setUploadingField(name);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // The backend returns { url: "/uploads/..." }
      const fileUrl = "http://localhost:5000" + response.data.url;
      setValues((prev) => ({ ...prev, [name]: fileUrl }));
    } catch (err) {
      setError(err?.message || "Failed to upload file.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = buildPayload(fields, values);
      const response = editingItem?.id
        ? await api.put(`${config.endpoint}/${editingItem.id}`, payload)
        : await api.post(config.endpoint, payload);

      onSaved?.(response.data);
      onClose?.();
    } catch (err) {
      setError(err?.message || "Failed to save. Please review fields and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 right-0 w-full max-w-xl overflow-y-auto border-l border-border bg-background shadow-panel">
        <div className="flex items-start justify-between gap-4 border-b border-border/70 px-6 py-6">
          <div>
            <p className="font-heading text-2xl font-semibold">
              {mode === "edit" ? `Edit ${title}` : `Add ${title}`}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "edit" ? "Update details and save changes." : "Fill in the required information to create a record."}
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          {error ? (
            <div className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          ) : null}

          {fields.map((field) => {
            const value = values[field.name] ?? "";
            const required = Boolean(field.required);

            const label = (
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {field.label}
                </p>
                {required ? (
                  <span className="text-[11px] font-semibold text-primary">Required</span>
                ) : null}
              </div>
            );

            if (field.type === "textarea") {
              return (
                <div key={field.name} className="space-y-2">
                  {label}
                  <Textarea
                    value={value}
                    required={required}
                    placeholder={field.placeholder}
                    onChange={(event) => handleChange(field.name, event.target.value)}
                  />
                </div>
              );
            }

            if (field.type === "json") {
              return (
                <div key={field.name} className="space-y-2">
                  {label}
                  <Textarea
                    value={value}
                    required={required}
                    placeholder={field.placeholder}
                    onChange={(event) => handleChange(field.name, event.target.value)}
                    className="font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide valid JSON (array/object). Invalid JSON will save as an empty array.
                  </p>
                </div>
              );
            }

            if (field.type === "select") {
              const fieldOptions = field.source ? options[field.name] || [] : field.options || [];

              return (
                <div key={field.name} className="space-y-2">
                  {label}
                  <Select
                    value={value}
                    required={required}
                    onChange={(event) => handleChange(field.name, event.target.value)}
                  >
                    <option value="">{field.placeholder || "Select an option"}</option>
                    {fieldOptions.map((option) => {
                      const optionValue = field.source
                        ? option[field.source.valueKey]
                        : option.value;
                      const optionLabel = field.source
                        ? field.source.label(option)
                        : option.label;
                      return (
                        <option key={optionValue} value={optionValue}>
                          {optionLabel}
                        </option>
                      );
                    })}
                  </Select>
                </div>
              );
            }

            if (field.type === "checkbox") {
              return (
                <label
                  key={field.name}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(values[field.name])}
                    onChange={(event) => handleChange(field.name, event.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="text-sm font-medium">{field.label}</span>
                </label>
              );
            }

            if (field.type === "file" || field.type === "image") {
              return (
                <div key={field.name} className="space-y-2">
                  {label}
                  <div className="flex items-center gap-4">
                    {value && (
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border">
                        <img src={value} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept={field.type === "image" ? "image/*" : undefined}
                      onChange={(event) => handleFileUpload(field.name, event.target.files[0])}
                      disabled={uploadingField === field.name}
                    />
                  </div>
                  {uploadingField === field.name && <p className="text-xs text-primary">Uploading...</p>}
                </div>
              );
            }

            const inputType =
              field.type === "number"
                ? "number"
                : field.type === "date"
                  ? "date"
                  : field.type === "email"
                    ? "email"
                    : field.type === "password"
                      ? "password"
                      : "text";

            return (
              <div key={field.name} className="space-y-2">
                {label}
                <Input
                  type={inputType}
                  value={value}
                  required={required}
                  placeholder={field.placeholder}
                  onChange={(event) => handleChange(field.name, event.target.value)}
                />
              </div>
            );
          })}

          <div className={cn("flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end")}>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading || uploadingField}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploadingField}>
              {loading ? "Saving..." : uploadingField ? "Uploading..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

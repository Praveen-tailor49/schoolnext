"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function PromoteModal({ onClose }) {
  const [form, setForm] = useState({
    fromSession: "2025-2026",
    fromClass: "",
    fromSection: "",
    toSession: "2026-2027",
    toClass: "",
    toSection: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/students/action/promote", form);
      setSuccess(res.data.message);
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to promote students");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <Card className="w-full max-w-lg bg-white shadow-2xl animate-enter">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
          <h2 className="text-xl font-bold text-slate-800">Promote Students (Academic Rollover)</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            ✕
          </button>
        </div>
        <CardContent className="p-6">
          {success ? (
            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg text-center font-medium">
              ✅ {success}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded text-sm">{error}</div>}
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <h3 className="font-bold text-slate-700 text-sm tracking-wider uppercase">Promote From</h3>
                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">Session</label>
                    <Input required value={form.fromSession} onChange={e => setForm({...form, fromSession: e.target.value})} placeholder="e.g. 2025-2026" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">Class</label>
                    <Input required value={form.fromClass} onChange={e => setForm({...form, fromClass: e.target.value})} placeholder="e.g. 5" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">Section</label>
                    <Input required value={form.fromSection} onChange={e => setForm({...form, fromSection: e.target.value})} placeholder="e.g. A" />
                  </div>
                </div>

                <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h3 className="font-bold text-primary text-sm tracking-wider uppercase">Promote To</h3>
                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">Session</label>
                    <Input required value={form.toSession} onChange={e => setForm({...form, toSession: e.target.value})} placeholder="e.g. 2026-2027" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">Class</label>
                    <Input required value={form.toClass} onChange={e => setForm({...form, toClass: e.target.value})} placeholder="e.g. 6" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">Section</label>
                    <Input required value={form.toSection} onChange={e => setForm({...form, toSection: e.target.value})} placeholder="e.g. A" />
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded text-amber-800 text-xs">
                <strong>Note:</strong> Promoting students will upgrade their class and auto-generate new fee records for the new session. Any pending fees from previous sessions will remain untouched.
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-primary">
                  {loading ? "Processing..." : "Promote Batch"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

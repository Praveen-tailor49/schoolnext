"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export default function StructuresTab() {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [newStruct, setNewStruct] = useState({
    sessionId: "2026-2027",
    classId: "",
    sectionId: "",
    annualFee: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const structRes = await api.get("/fee-structures");
      setStructures(structRes.data?.items || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createStructure = async () => {
    if (!newStruct.classId || !newStruct.sectionId || !newStruct.annualFee) return;
    try {
      await api.post("/fee-structures", {
        sessionId: newStruct.sessionId,
        classId: newStruct.classId,
        sectionId: newStruct.sectionId,
        annualFee: parseFloat(newStruct.annualFee)
      });
      setNewStruct({ ...newStruct, classId: "", sectionId: "", annualFee: "" });
      fetchData();
    } catch (err) {
      alert("Failed to create structure. It might be a duplicate.");
    }
  };

  const deleteStructure = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/fee-structures/${id}`);
      fetchData();
    } catch (err) {
      alert("Cannot delete, it might be in use.");
    }
  };

  if (loading) return (
    <div className="rounded-2xl border border-border bg-card/60 shadow-panel overflow-hidden mt-6">
      <TableSkeleton columns={5} rows={5} />
    </div>
  );

  const filteredStructures = structures.filter(s => {
    const searchStr = `${s.sessionId} ${s.classId} ${s.sectionId}`.toLowerCase();
    return searchStr.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-lg font-semibold">Class Fee Structures</h3>
            <div className="w-full sm:w-72">
              <Input 
                placeholder="Search by session, class, or section..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6 items-end bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Session</label>
              <Input placeholder="e.g. 2026-2027" value={newStruct.sessionId} onChange={e => setNewStruct({...newStruct, sessionId: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Class</label>
              <Input placeholder="e.g. 1" value={newStruct.classId} onChange={e => setNewStruct({...newStruct, classId: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Section</label>
              <Input placeholder="e.g. A" value={newStruct.sectionId} onChange={e => setNewStruct({...newStruct, sectionId: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Annual Fee (₹)</label>
              <Input type="number" placeholder="0.00" value={newStruct.annualFee} onChange={e => setNewStruct({...newStruct, annualFee: e.target.value})} />
            </div>
            <Button onClick={createStructure} className="h-10">Add</Button>
          </div>

          <div className="border rounded-xl overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Annual Fee</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStructures.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.sessionId}</TableCell>
                    <TableCell>Class {s.classId}</TableCell>
                    <TableCell>Section {s.sectionId}</TableCell>
                    <TableCell>₹{s.annualFee}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => deleteStructure(s.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredStructures.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-slate-500">
                      {searchQuery ? "No fee structures found matching your search." : "No fee structures defined."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

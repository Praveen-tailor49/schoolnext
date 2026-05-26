"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import PaymentModal from "./payment-modal";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export default function DuesTab() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const feesRes = await api.get("/fees");
      setFees(feesRes.data?.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === "Paid") return <Badge variant="success">Paid</Badge>;
    if (status === "Partially Paid") return <Badge variant="warning">Partial</Badge>;
    return <Badge variant="secondary">Due</Badge>;
  };

  const filteredFees = fees.filter(fee => {
    if (!searchQuery) return true;
    const fullName = `${fee.student?.firstName || ""} ${fee.student?.lastName || ""} ${fee.student?.admissionNo || ""}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  if (loading) return (
    <div className="rounded-2xl border border-border bg-card/60 shadow-panel overflow-hidden mt-6">
      <TableSkeleton columns={7} rows={5} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Input 
          placeholder="Search students or admission no..." 
          className="max-w-xs" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <p className="text-sm text-slate-500">Fees are auto-assigned based on class structure.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="pl-6">Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Total Fee</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Due Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="pl-6 font-medium">
                    {fee.student?.firstName} {fee.student?.lastName}
                    <div className="text-xs text-slate-500">{fee.student?.admissionNo}</div>
                  </TableCell>
                  <TableCell>
                    Class {fee.feeStructure?.classId} {fee.feeStructure?.sectionId}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{fee.feeStructure?.sessionId}</Badge>
                  </TableCell>
                  <TableCell>₹{fee.totalFee}</TableCell>
                  <TableCell className="text-rose-500">₹{fee.discount || 0}</TableCell>
                  <TableCell className="text-red-500 font-medium">₹{fee.dueAmount}</TableCell>
                  <TableCell>{getStatusBadge(fee.status)}</TableCell>
                  <TableCell className="pr-6 text-right">
                    {fee.status !== "Paid" && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => {
                          setSelectedFee(fee);
                          setPaymentModalOpen(true);
                        }}
                      >
                        Collect Payment
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredFees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-slate-500">No fee records found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {paymentModalOpen && selectedFee && (
        <PaymentModal 
          fee={selectedFee} 
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedFee(null);
          }} 
          onSuccess={() => {
            setPaymentModalOpen(false);
            setSelectedFee(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

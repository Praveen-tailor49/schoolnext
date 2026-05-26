"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ReceiptViewer from "./receipt-viewer";

export default function PaymentModal({ fee, onClose, onSuccess }) {
  const [form, setForm] = useState({
    amount: fee.dueAmount?.toString() || fee.amount?.toString() || "0",
    discount: "0",
    method: "cash"
  });

  const [receipt, setReceipt] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const handleSubmit = async () => {
    try {
      const { data } = await api.post("/fees/pay", {
        studentFeeId: fee.id,
        amount: parseFloat(form.amount) || 0,
        discount: parseFloat(form.discount) || 0,
        method: form.method
      });
      setReceipt(data.receipt || { receiptNumber: data.payment?.receiptNumber });
      setPaymentData(data.payment);
    } catch (err) {
      alert(err?.response?.data?.message || "Payment failed");
    }
  };

  const calculateTotal = () => {
    return parseFloat(form.amount) || 0;
  };

  if (receipt) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <ReceiptViewer 
          receipt={receipt} 
          payment={paymentData} 
          fee={fee} 
          onClose={onSuccess} 
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <Card className="w-full max-w-lg my-auto">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Collect Payment</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">×</button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl mb-6">
            <p className="font-semibold text-slate-900">{fee.student?.firstName} {fee.student?.lastName}</p>
            <div className="flex justify-between text-sm text-slate-500 mt-1">
              <span>{fee.feeStructure?.sessionId} - Class {fee.feeStructure?.classId}</span>
              <span className="font-medium text-slate-900">Total: ₹{fee.totalFee || fee.amount} | Due: ₹{fee.dueAmount}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Amount to Pay (₹)</label>
                <Input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Discount Given (₹)</label>
                <Input type="number" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Payment Method</label>
                <select 
                  className="w-full h-10 px-3 rounded-lg border border-slate-200"
                  value={form.method} onChange={e => setForm({...form, method: e.target.value})}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm font-medium text-slate-500">Total Paying</span>
              <span className="text-xl font-bold text-slate-900">₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Button className="flex-1" onClick={handleSubmit}>Process Payment</Button>
            <Button className="flex-1" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

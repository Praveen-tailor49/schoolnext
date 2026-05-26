"use client";

import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Download, Mail } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ReceiptViewer({ receipt, payment, fee, onClose }) {
  const receiptRef = useRef(null);

  const handleDownloadPdf = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const element = receiptRef.current;
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${receipt.receiptNumber}.pdf`);
    } catch (error) {
      console.error("PDF generation failed", error);
      alert("Failed to generate PDF. Check console for details.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4">
      <div className="flex justify-end gap-2 print:hidden">
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" /> Print
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
          <Download className="w-4 h-4 mr-2" /> Download PDF
        </Button>
        <Button variant="outline" size="sm" onClick={() => alert("Email sent!")}>
          <Mail className="w-4 h-4 mr-2" /> Email
        </Button>
        <Button size="sm" onClick={onClose}>Close</Button>
      </div>

      <Card ref={receiptRef} className="bg-white text-slate-900 shadow-none border-slate-200">
        <CardContent className="p-8">
          <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">LearnNext ERP</h2>
              <p className="text-sm text-slate-500 mt-1">123 Education Lane, Learning City</p>
              <p className="text-sm text-slate-500">contact@learnnext.edu | +1 234 567 8900</p>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold text-slate-200 uppercase tracking-widest">Receipt</h1>
              <p className="text-sm font-medium mt-2">No: {receipt.receiptNumber}</p>
              <p className="text-sm text-slate-500">Date: {formatDate(payment?.paymentDate || new Date())}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Student Details</p>
              <p className="font-bold text-lg">{fee.student?.firstName} {fee.student?.lastName}</p>
              <p className="text-sm text-slate-600 mt-1">Admission No: {fee.student?.admissionNo}</p>
              <p className="text-sm text-slate-600">Class: {fee.student?.className} {fee.student?.section}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Payment Info</p>
              <p className="text-sm text-slate-600">Method: <span className="font-medium capitalize">{payment?.paymentMethod || payment?.method}</span></p>
              <p className="text-sm text-slate-600 mt-1">Status: <span className="font-medium text-emerald-600 capitalize">Successful</span></p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden mb-8">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-900">Session {fee.feeStructure?.sessionId || "Academic Year"} Fee</p>
                    <p className="text-xs text-slate-500">Total Base Fee</p>
                  </td>
                  <td className="px-4 py-4 text-right font-medium">₹{(fee.totalFee || fee.amount || 0).toFixed(2)}</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="px-4 py-4 text-right">Amount Paid</td>
                  <td className="px-4 py-4 text-right text-emerald-600">₹{(payment?.amount || 0).toFixed(2)}</td>
                </tr>
                {payment?.discount > 0 && (
                  <tr className="bg-rose-50/50 font-bold">
                    <td className="px-4 py-4 text-right text-rose-600">Discount Applied</td>
                    <td className="px-4 py-4 text-right text-rose-600">-₹{payment.discount.toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-end pt-12">
            <div className="text-sm text-slate-500">
              <p>This is a computer generated receipt.</p>
              <p>No physical signature required.</p>
            </div>
            <div className="text-center">
              <div className="w-40 border-b border-slate-300 mb-2"></div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Authorized Signatory</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

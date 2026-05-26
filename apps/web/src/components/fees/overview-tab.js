"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, TrendingUp, AlertCircle, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function OverviewTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/fees/dashboard/stats");
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[104px] w-full" />
          <Skeleton className="h-[104px] w-full" />
          <Skeleton className="h-[104px] w-full" />
          <Skeleton className="h-[104px] w-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="col-span-4 h-[300px] w-full" />
          <Skeleton className="col-span-3 h-[300px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-slate-500">Collection Today</p>
              <Banknote className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold">₹{stats?.todayCollection || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-slate-500">Collection This Month</p>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">₹{stats?.monthCollection || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-slate-500">Pending Dues</p>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold">₹{stats?.pendingAmount || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-red-100 shadow-sm bg-red-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-red-600">Year Collection</p>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-700">₹{stats?.yearCollection || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest ledger movements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentTransactions?.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {txn.studentFee?.student?.firstName} {txn.studentFee?.student?.lastName}
                    </p>
                    <p className="text-xs text-slate-500">Receipt: {txn.receiptNumber} | {txn.paymentMethod}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-600">
                      +₹{txn.amount}
                    </p>
                    <p className="text-xs text-slate-400">{formatDate(txn.paymentDate)}</p>
                  </div>
                </div>
              ))}
              {!stats?.recentTransactions?.length && (
                <p className="text-sm text-slate-500 text-center py-4">No recent transactions</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 bg-white border-slate-200 shadow-sm flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-800">Visual Analytics</h3>
            <p className="text-slate-500 mt-2 text-sm max-w-xs">Detailed revenue charts will appear here as more data points are collected across months.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

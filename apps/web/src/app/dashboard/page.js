"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { formatDate } from "@/lib/utils";

const colors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--danger))"];

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    api
      .get("/dashboard/summary")
      .then((response) => {
        if (!active) return;
        setData(response.data);
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.message || "Failed to load dashboard.");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-[130px] animate-pulse rounded-2xl border border-border bg-card/60"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-danger/30 bg-danger/10 px-5 py-4 text-danger">
        {error}
      </div>
    );
  }

  const stats = data?.stats || {};
  const attendanceOverview = data?.attendanceOverview || [];
  const financeOverview = data?.financeOverview || [];
  const notices = data?.recentNotices || [];
  const upcomingExams = data?.upcomingExams || [];
  const isStudent = data?.role === "student" || data?.role === "parent";
  const studentFees = data?.studentFees || [];
  const pl = data?.pl || { income: 0, expenses: 0, payroll: 0 };
  const defaulters = data?.defaulters || [];
  const homework = data?.homework || [];
  const results = data?.results || [];

  if (isStudent) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="animate-enter">
            <CardHeader>
              <CardDescription>My Attendance (Present)</CardDescription>
              <CardTitle className="text-3xl">{stats.attendance || 0} Days</CardTitle>
            </CardHeader>
          </Card>
          <Card className="animate-enter" style={{ animationDelay: "50ms" }}>
            <CardHeader>
              <CardDescription>My Pending Fees</CardDescription>
              <CardTitle className="text-3xl text-danger">₹{stats.pendingFees || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="animate-enter" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <CardDescription>Upcoming Exams</CardDescription>
              <CardTitle className="text-3xl text-primary">{stats.upcomingExams || 0}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notices</CardTitle>
              <CardDescription>Latest announcements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {notices.length ? (
                notices.map((notice) => (
                  <div key={notice.id} className="rounded-2xl border border-border bg-secondary/40 p-4">
                    <p className="font-semibold">{notice.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{notice.description}</p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Published {formatDate(notice.publishDate)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No notices yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Fee Schedule</CardTitle>
              <CardDescription>Current fee status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {studentFees.length ? (
                studentFees.map((fee) => (
                  <div key={fee.id} className="rounded-2xl border border-border bg-secondary/40 p-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold">₹{fee.totalFee}</p>
                      <Badge variant={fee.status === "Paid" ? "success" : fee.status === "Due" ? "danger" : "warning"}>
                        {fee.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Due: ₹{fee.dueAmount}</p>
                    {fee.status === "Due" && (
                      <button 
                        onClick={() => alert(`Mock Payment Gateway\n\nRedirecting to pay ₹${fee.dueAmount}...`)}
                        className="w-full rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition"
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No fees assigned.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Pending Homework</CardTitle>
              <CardDescription>Assignments due soon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {homework.length ? (
                homework.map((hw) => (
                  <div key={hw.id} className="rounded-2xl border border-border bg-secondary/40 p-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold">{hw.title}</p>
                      <Badge variant="default">{hw.subject}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{hw.description}</p>
                    <p className="text-xs text-muted-foreground font-semibold">
                      Due: {formatDate(hw.dueDate)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No pending homework. Yay!</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Results</CardTitle>
              <CardDescription>Performance overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.length ? (
                results.map((res) => (
                  <div key={res.id} className="rounded-2xl border border-border bg-secondary/40 p-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold">{res.exam?.title}</p>
                      <span className="font-bold text-primary text-lg">{res.grade}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Subject: {res.exam?.subject}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Marks: {res.marksObtained} / {res.exam?.totalMarks}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No results published yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const profit = pl.income - pl.expenses - pl.payroll;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: "Total Income", value: `₹${pl.income.toLocaleString()}`, color: "text-success" },
          { label: "Total Expenses", value: `₹${pl.expenses.toLocaleString()}`, color: "text-danger" },
          { label: "Total Payroll", value: `₹${pl.payroll.toLocaleString()}`, color: "text-warning" },
          { label: "Net Profit", value: `₹${profit.toLocaleString()}`, color: profit >= 0 ? "text-success" : "text-danger" },
        ].map((card) => (
          <Card key={card.label} className="animate-enter bg-secondary/20">
            <CardHeader className="py-4">
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className={`text-2xl ${card.color}`}>{card.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Students", value: stats.students },
          { label: "Teachers", value: stats.teachers },
          { label: "Pending Fees", value: `₹${stats.pendingFees || 0}` },
          { label: "Library Books", value: stats.libraryBooks },
        ].map((card) => (
          <Card key={card.label} className="animate-enter">
            <CardHeader>
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className="text-3xl">{card.value ?? 0}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Fee Collections</CardTitle>
            <CardDescription>Payments by month</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financeOverview}>
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 14,
                  }}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Mix</CardTitle>
            <CardDescription>Present vs absent vs leave</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={attendanceOverview} dataKey="value" nameKey="name" outerRadius={100}>
                  {attendanceOverview.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 14,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Notices</CardTitle>
            <CardDescription>Latest announcements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notices.length ? (
              notices.map((notice) => (
                <div key={notice.id} className="rounded-2xl border border-border bg-secondary/40 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{notice.title}</p>
                    <Badge variant="info">{notice.audience}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{notice.description}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Published {formatDate(notice.publishDate)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No notices yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Fee Defaulters</CardTitle>
            <CardDescription>Students with highest due amount</CardDescription>
          </CardHeader>
          <CardContent>
            {defaulters.length ? (
              <div className="space-y-4">
                {defaulters.map((fee) => (
                  <div key={fee.id} className="flex items-center justify-between rounded-2xl border border-border bg-secondary/40 p-4">
                    <div>
                      <p className="font-semibold">{fee.student?.firstName} {fee.student?.lastName}</p>
                      <p className="text-sm text-muted-foreground">
                        Class {fee.student?.className} | Adm No: {fee.student?.admissionNo}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-danger text-lg">₹{fee.dueAmount}</p>
                      <button className="text-xs font-semibold text-primary mt-1 hover:underline">
                        Send Reminder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No defaulters found.</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
            <CardDescription>Next scheduled assessments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingExams.length ? (
              upcomingExams.map((exam) => (
                <div key={exam.id} className="rounded-2xl border border-border bg-secondary/40 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{exam.title}</p>
                    <Badge variant="default">
                      {exam.className} {exam.section}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{exam.subject}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {formatDate(exam.date)} · Total {exam.totalMarks}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming exams.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


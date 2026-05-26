import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function AuthShell({ title, description, footer, children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 py-10">
      <div className="absolute inset-0 bg-grid-fade bg-[size:32px_32px] opacity-30" />
      <div className="absolute left-[-10rem] top-[-8rem] h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-[-10rem] right-[-6rem] h-72 w-72 rounded-full bg-warning/20 blur-3xl" />
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden rounded-[2rem] border border-border/70 bg-slate-950 p-10 text-slate-50 shadow-panel lg:block">
            <Link href="/" className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
              <span className="rounded-2xl bg-white/10 p-3">
                <GraduationCap className="h-5 w-5" />
              </span>
              LearnNext ERP
            </Link>
            <div className="mt-14 max-w-md space-y-4">
              <p className="font-heading text-4xl leading-tight text-white">
                School operations in one fast, reusable control room.
              </p>
              <p className="text-base text-slate-300">
                Manage students, teachers, fees, attendance, exams, library, and parent communication from one system.
              </p>
            </div>
          </div>
          <div className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-panel backdrop-blur sm:p-8">
            <div className="mb-8 space-y-2">
              <p className="font-heading text-3xl font-semibold">{title}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {children}
            {footer ? <div className="mt-6 text-sm text-muted-foreground">{footer}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

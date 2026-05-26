import { cn } from "@/lib/utils";

export const Table = ({ className, ...props }) => (
  <div className="overflow-x-auto">
    <table className={cn("w-full min-w-[760px] text-left text-sm", className)} {...props} />
  </div>
);

export const TableHeader = ({ className, ...props }) => (
  <thead className={cn("border-b border-border", className)} {...props} />
);

export const TableBody = ({ className, ...props }) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
);

export const TableRow = ({ className, ...props }) => (
  <tr className={cn("border-b border-border/70 transition hover:bg-secondary/60", className)} {...props} />
);

export const TableHead = ({ className, ...props }) => (
  <th
    className={cn(
      "px-4 py-3 font-heading text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground",
      className
    )}
    {...props}
  />
);

export const TableCell = ({ className, ...props }) => (
  <td className={cn("px-4 py-3 align-top", className)} {...props} />
);


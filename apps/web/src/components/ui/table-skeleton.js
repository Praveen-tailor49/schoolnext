import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ columns = 5, rows = 5 }) {
  return (
    <div className="w-full animate-in fade-in duration-300">
      <div className="flex border-b border-slate-100 bg-slate-50/50 p-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1 mx-2" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex border-b border-slate-50 p-4 items-center">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className={`h-4 flex-1 mx-2 ${colIndex === 0 ? "w-1/2" : ""}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] cursor-wait">
      <div className="flex items-center gap-3 bg-white/90 px-5 py-3 rounded-2xl shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="h-5 w-5 animate-spin rounded-full border-[3px] border-primary border-t-transparent"></div>
        <span className="font-semibold text-slate-700 text-sm tracking-wide">Loading...</span>
      </div>
    </div>
  );
}

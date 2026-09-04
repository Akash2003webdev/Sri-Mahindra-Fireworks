// Lightweight, on-brand loading state shown while a route chunk streams in.
// Kept intentionally tiny (no images/animation libs) so it never becomes
// part of the thing slowing the page down.
export default function PageLoader() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3">
      <div className="relative h-9 w-9">
        <div className="absolute inset-0 rounded-full border-[3px] border-gold-200" />
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-primary-600" />
      </div>
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
        Loading
      </span>
    </div>
  );
}

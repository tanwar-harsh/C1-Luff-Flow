export function AuthDivider() {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="h-px flex-grow bg-outline-variant" />
      <span className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
        Or continue with
      </span>
      <div className="h-px flex-grow bg-outline-variant" />
    </div>
  );
}

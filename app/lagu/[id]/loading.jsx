export default function LoadingSongDetail() {
  return (
    <div className="flex flex-col items-center gap-6 animate-pulse">
      <div className="w-48 h-48 rounded-2xl bg-surface border border-border" />
      <div className="h-5 w-40 bg-surface rounded" />
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-surface" />
        <div className="w-11 h-11 rounded-full bg-surface" />
        <div className="w-11 h-11 rounded-full bg-surface" />
      </div>
    </div>
  );
}

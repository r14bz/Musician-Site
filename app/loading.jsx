export default function LoadingBeranda() {
  return (
    <div className="flex flex-col gap-14 animate-pulse">
      <section className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-44 h-60 rounded-3xl bg-surface border border-border shrink-0" />
        <div className="flex flex-col items-center md:items-start gap-3 w-full">
          <div className="h-6 w-48 bg-surface rounded" />
          <div className="h-3 w-64 bg-surface rounded" />
          <div className="h-3 w-52 bg-surface rounded" />
          <div className="h-9 w-40 bg-surface rounded-full mt-2" />
        </div>
      </section>

      <section>
        <div className="h-3 w-20 bg-surface rounded mb-3" />
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 rounded-xl border border-border bg-surface"
            />
          ))}
        </div>
      </section>
    </div>
  );
}

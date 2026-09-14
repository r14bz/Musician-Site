export default function VideoSection({ videos }) {
  if (!videos || videos.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-mono text-muted mb-3">video</h2>
      <div className="flex flex-col gap-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="rounded-xl overflow-hidden border border-border aspect-video"
          >
            <iframe
              src={`https://www.youtube.com/embed/${video.youtube_id}`}
              title={video.title || "Video"}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ))}
      </div>
    </section>
  );
}

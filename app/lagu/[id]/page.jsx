import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabaseServer";
import SongDetailPlayer from "@/components/SongDetailPlayer";

export async function generateMetadata({ params }) {
  const supabase = createServerSupabase();
  const { data: song } = await supabase
    .from("songs")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!song) return { title: "Lagu tidak ditemukan" };

  return {
    title: song.title,
    description: `Dengarkan "${song.title}" oleh Riabz Microphone.`,
    openGraph: {
      title: song.title,
      description: `Dengarkan "${song.title}" oleh Riabz Microphone.`,
      images: song.cover_url ? [song.cover_url] : undefined,
    },
  };
}

export default async function SongDetailPage({ params }) {
  const supabase = createServerSupabase();
  const { data: song } = await supabase
    .from("songs")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!song) notFound();

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {song.cover_url ? (
        <img
          src={song.cover_url}
          alt={song.title}
          className="w-48 h-48 rounded-2xl object-cover border border-border"
        />
      ) : (
        <div className="w-48 h-48 rounded-2xl bg-surface border border-border" />
      )}

      <div>
        <h1 className="text-lg font-medium">{song.title}</h1>
        <p className="text-xs text-muted font-mono mt-1">
          {song.play_count || 0}x diputar
        </p>
      </div>

      <SongDetailPlayer song={song} />

      {song.lyrics && (
        <div className="w-full text-left border border-border rounded-xl p-4 bg-surface">
          <p className="text-xs text-muted font-mono mb-2">lirik</p>
          <p className="text-sm whitespace-pre-line">{song.lyrics}</p>
        </div>
      )}
    </div>
  );
}

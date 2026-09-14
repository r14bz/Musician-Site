"use client";

import { Play, Pause, Download, Share2 } from "lucide-react";
import { usePlayer } from "@/lib/PlayerContext";

export default function SongDetailPlayer({ song }) {
  const { currentSong, isPlaying, play } = usePlayer();
  const isThisPlaying = currentSong?.id === song.id && isPlaying;

  async function handleShare() {
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: song.title,
          text: `Dengarkan "${song.title}"`,
          url: shareUrl,
        });
      } catch (e) {
        // dibatalkan oleh user
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("Tautan lagu disalin ke clipboard");
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => play(song)}
        aria-label={isThisPlaying ? "Jeda" : "Putar"}
        className="w-12 h-12 rounded-full bg-accent text-black flex items-center justify-center"
      >
        {isThisPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>

      <a
        href={song.audio_url}
        download
        aria-label="Download"
        className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted hover:text-white transition-colors"
      >
        <Download size={18} />
      </a>

      <button
        onClick={handleShare}
        aria-label="Bagikan"
        className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted hover:text-white transition-colors"
      >
        <Share2 size={18} />
      </button>
    </div>
  );
}

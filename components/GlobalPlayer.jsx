"use client";

import Link from "next/link";
import { Play, Pause } from "lucide-react";
import { usePlayer } from "@/lib/PlayerContext";

export default function GlobalPlayer() {
  const { currentSong, isPlaying, play } = usePlayer();

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-[#0d0d0e]/95 backdrop-blur z-50">
      <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => play(currentSong)}
          aria-label={isPlaying ? "Jeda" : "Putar"}
          className="w-10 h-10 shrink-0 rounded-full bg-accent text-black flex items-center justify-center"
        >
          {isPlaying ? <Pause size={17} /> : <Play size={17} />}
        </button>

        {currentSong.cover_url ? (
          <img
            src={currentSong.cover_url}
            alt={currentSong.title}
            className="w-10 h-10 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-surface shrink-0" />
        )}

        <Link
          href={`/lagu/${currentSong.id}`}
          className="flex-1 min-w-0 text-sm truncate hover:underline"
        >
          {currentSong.title}
        </Link>

        <div className="flex items-end gap-[3px] h-5 w-6 shrink-0">
          {isPlaying &&
            [1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`w-1 bg-accent rounded-sm wave-bar wave-bar-${i}`}
              />
            ))}
        </div>
      </div>

      <style>{`
        @keyframes waveBounce {
          0%, 100% { height: 4px; }
          50% { height: 18px; }
        }
        .wave-bar { animation: waveBounce 1s ease-in-out infinite; }
        .wave-bar-1 { animation-delay: 0s; }
        .wave-bar-2 { animation-delay: 0.15s; }
        .wave-bar-3 { animation-delay: 0.3s; }
        .wave-bar-4 { animation-delay: 0.45s; }
      `}</style>
    </div>
  );
}

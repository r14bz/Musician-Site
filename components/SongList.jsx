"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, Pause, Download, Share2, ChevronDown } from "lucide-react";
import { usePlayer } from "@/lib/PlayerContext";

function formatPlayCount(count) {
  const n = count || 0;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}jt`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}rb`;
  return `${n}`;
}

function EqualizerBars() {
  return (
    <div className="flex items-end gap-[2px] h-4 w-4 shrink-0">
      <span className="w-1 bg-accent rounded-sm eq-bar eq-bar-1" />
      <span className="w-1 bg-accent rounded-sm eq-bar eq-bar-2" />
      <span className="w-1 bg-accent rounded-sm eq-bar eq-bar-3" />
    </div>
  );
}

export default function SongList({ songs }) {
  const { currentSong, isPlaying, play } = usePlayer();
  const [openLyricsId, setOpenLyricsId] = useState(null);

  async function handleShare(song) {
    const shareUrl = `${window.location.origin}/lagu/${song.id}`;

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

  if (!songs || songs.length === 0) {
    return (
      <p className="text-sm text-muted">Belum ada lagu yang diupload.</p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <style>{`
        @keyframes eqBounce {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        .eq-bar { animation: eqBounce 0.9s ease-in-out infinite; }
        .eq-bar-1 { animation-delay: 0s; }
        .eq-bar-2 { animation-delay: 0.2s; }
        .eq-bar-3 { animation-delay: 0.4s; }

        @keyframes cardGlow {
          0%, 100% { border-color: #232327; }
          50% { border-color: #5EEAD4; }
        }
        .playing-card { animation: cardGlow 1.8s ease-in-out infinite; }
      `}</style>

      {songs.map((song) => {
        const isActive = currentSong?.id === song.id;
        const isThisPlaying = isActive && isPlaying;
        const lyricsOpen = openLyricsId === song.id;

        return (
          <div
            key={song.id}
            id={`lagu-${song.id}`}
            className={`flex flex-col border rounded-xl px-4 py-3 bg-surface transition-colors ${
              isThisPlaying ? "playing-card" : "border-border"
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => play(song)}
                aria-label={isThisPlaying ? "Jeda" : "Putar"}
                className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-colors ${
                  isThisPlaying
                    ? "bg-accent text-black"
                    : "bg-accent/10 text-accent hover:bg-accent/20"
                }`}
              >
                {isThisPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>

              {song.cover_url ? (
                <img
                  src={song.cover_url}
                  alt={song.title}
                  className="w-9 h-9 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-base shrink-0" />
              )}

              <div className="flex-1 min-w-0 flex items-center gap-2">
                <Link
                  href={`/lagu/${song.id}`}
                  className="text-sm truncate hover:underline"
                >
                  {song.title}
                </Link>
                {isThisPlaying && <EqualizerBars />}
              </div>

              <span className="text-xs text-muted font-mono shrink-0">
                {formatPlayCount(song.play_count)}x
              </span>

              <a
                href={song.audio_url}
                download
                aria-label="Download"
                className="text-muted hover:text-white transition-colors"
              >
                <Download size={17} />
              </a>

              <button
                onClick={() => handleShare(song)}
                aria-label="Bagikan"
                className="text-muted hover:text-white transition-colors"
              >
                <Share2 size={17} />
              </button>

              {song.lyrics && (
                <button
                  onClick={() => setOpenLyricsId(lyricsOpen ? null : song.id)}
                  aria-label="Lirik"
                  className={`transition-transform ${
                    lyricsOpen ? "rotate-180" : ""
                  } text-muted hover:text-white`}
                >
                  <ChevronDown size={17} />
                </button>
              )}
            </div>

            {lyricsOpen && song.lyrics && (
              <p className="text-xs text-muted whitespace-pre-line mt-3 pt-3 border-t border-border">
                {song.lyrics}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

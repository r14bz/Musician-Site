"use client";

import { useRef, useState } from "react";
import { Play, Pause, Download, Share2 } from "lucide-react";

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
  const [playingId, setPlayingId] = useState(null);
  const audioRefs = useRef({});

  function togglePlay(song) {
    const currentAudio = audioRefs.current[song.id];

    Object.entries(audioRefs.current).forEach(([id, audio]) => {
      if (id !== String(song.id) && audio) {
        audio.pause();
      }
    });

    if (playingId === song.id) {
      currentAudio.pause();
      setPlayingId(null);
    } else {
      currentAudio.play();
      setPlayingId(song.id);
    }
  }

  async function handleShare(song) {
    const shareUrl = `${window.location.origin}/#lagu-${song.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: song.title,
          text: `Dengarkan "${song.title}"`,
          url: shareUrl,
        });
      } catch (e) {
        // dibatalkan oleh user, tidak perlu ditangani
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
        const isPlaying = playingId === song.id;
        return (
          <div
            key={song.id}
            id={`lagu-${song.id}`}
            className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-surface transition-colors ${
              isPlaying ? "playing-card" : "border-border"
            }`}
          >
            <button
              onClick={() => togglePlay(song)}
              aria-label={isPlaying ? "Jeda" : "Putar"}
              className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-colors ${
                isPlaying
                  ? "bg-accent text-black"
                  : "bg-accent/10 text-accent hover:bg-accent/20"
              }`}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <div className="flex-1 min-w-0 flex items-center gap-2">
              <p className="text-sm truncate">{song.title}</p>
              {isPlaying && <EqualizerBars />}
            </div>

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

            <audio
              ref={(el) => (audioRefs.current[song.id] = el)}
              src={song.audio_url}
              onEnded={() => setPlayingId(null)}
              preload="none"
            />
          </div>
        );
      })}
    </div>
  );
}

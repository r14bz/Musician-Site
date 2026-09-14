"use client";

import { useRef, useState } from "react";
import { Play, Pause, Download, Share2 } from "lucide-react";

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
      {songs.map((song) => (
        <div
          key={song.id}
          id={`lagu-${song.id}`}
          className="flex items-center gap-3 border border-border rounded-xl px-4 py-3 bg-surface"
        >
          <button
            onClick={() => togglePlay(song)}
            aria-label={playingId === song.id ? "Jeda" : "Putar"}
            className="w-9 h-9 shrink-0 rounded-full bg-accent/10 text-accent flex items-center justify-center hover:bg-accent/20 transition-colors"
          >
            {playingId === song.id ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{song.title}</p>
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
      ))}
    </div>
  );
}

"use client";

import { createContext, useContext, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabaseClient";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const supabase = createClient();

  const play = useCallback(
    (song) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (currentSong?.id === song.id) {
        if (isPlaying) {
          audio.pause();
          setIsPlaying(false);
        } else {
          audio.play();
          setIsPlaying(true);
        }
        return;
      }

      audio.src = song.audio_url;
      audio.play();
      setCurrentSong(song);
      setIsPlaying(true);
      supabase.rpc("increment_play_count", { song_id: song.id }).then(() => {});
    },
    [currentSong, isPlaying, supabase]
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  return (
    <PlayerContext.Provider
      value={{ currentSong, isPlaying, play, pause, audioRef }}
    >
      {children}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer harus dipakai di dalam PlayerProvider");
  return ctx;
}

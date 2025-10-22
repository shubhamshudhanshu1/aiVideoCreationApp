"use client";

import { useEffect, useRef, useState, useMemo } from "react";

/** Props */
type Props = {
  src?: string; // .m3u8 or .mp4
  poster?: string; // thumbnail preview
  title: string;
  author: string;
  onCreateAgain?: () => void;
  onEdit?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBack?: () => void;
  className?: string;
};

export default function VideoPlayer({
  src,
  poster,
  title,
  author,
  onCreateAgain,
  onEdit,
  onLike,
  onDislike,
  onComment,
  onShare,
  onBack,
  className = "",
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);

  // HLS loader (SSR-safe)
  useEffect(() => {
    let hls: any | null = null;
    const v = videoRef.current;
    if (!v || !src) return;

    const load = async () => {
      if (src.endsWith(".m3u8")) {
        try {
          const Hls = (await import("hls.js")).default;
          if (Hls.isSupported()) {
            hls = new Hls({ enableWorker: true });
            hls.loadSource(src);
            hls.attachMedia(v);
            hls.on(Hls.Events.MANIFEST_PARSED, () => setReady(true));
          } else if (v.canPlayType("application/vnd.apple.mpegurl")) {
            v.src = src;
            v.oncanplay = () => setReady(true);
          }
        } catch (error) {
          console.warn("HLS.js not available, falling back to native support");
          v.src = src;
          v.oncanplay = () => setReady(true);
        }
      } else {
        v.src = src;
        v.oncanplay = () => setReady(true);
      }
    };
    load();
    return () => hls?.destroy();
  }, [src]);

  // progress tracking
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const t = () => setTime(v.currentTime);
    const d = () => setDur(v.duration || 0);
    v.addEventListener("timeupdate", t);
    v.addEventListener("loadedmetadata", d);
    return () => {
      v.removeEventListener("timeupdate", t);
      v.removeEventListener("loadedmetadata", d);
    };
  }, []);

  const fmt = (s: number) => {
    if (!Number.isFinite(s)) return "00:00";
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${ss}`;
  };

  const percent = useMemo(() => (dur ? (time / dur) * 100 : 0), [time, dur]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !dur) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * dur;
    v.currentTime = newTime;
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Video layer */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        poster={poster}
        playsInline
        loop
        muted
        autoPlay
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Dark gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/50 transition-colors"
          >
            <span className="text-white text-lg">←</span>
          </button>

          {/* Page Indicators */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-white rounded-full" />
            <div className="w-1 h-1 bg-white/50 rounded-full" />
          </div>
        </div>
      </div>

      {/* Right action rail */}
      <div className="absolute right-3 top-1/4 flex flex-col gap-3">
        <button
          className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors text-white"
          onClick={onCreateAgain}
          title="Remix"
        >
          ⟳
        </button>
        <button
          className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors text-white"
          onClick={onLike}
          title="Like"
        >
          👍
        </button>
        <button
          className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors text-white"
          onClick={onDislike}
          title="Dislike"
        >
          👎
        </button>
        <button
          className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors text-white"
          onClick={onComment}
          title="Comment"
        >
          💬
        </button>
        <button
          className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors text-white"
          onClick={onShare}
          title="Share"
        >
          ↗
        </button>
      </div>

      {/* Title + author */}
      <div className="absolute left-4 bottom-44 sm:bottom-48 text-white drop-shadow">
        <div className="text-2xl font-semibold">{title}</div>
        <div className="mt-2 flex items-center gap-2 text-sm opacity-90">
          <div className="h-6 w-6 rounded-full bg-white/30" />
          <span>@{author}</span>
        </div>
      </div>

      {/* Primary actions */}
      <div className="absolute left-4 right-4 bottom-32 flex gap-4">
        <button
          className="flex-1 px-6 py-3 rounded-full bg-white/15 text-white backdrop-blur border border-white/20 hover:bg-white/25 transition-colors"
          onClick={onCreateAgain}
        >
          ♫ Create Again
        </button>
        <button
          className="flex-1 px-6 py-3 rounded-full bg-white/15 text-white backdrop-blur border border-white/20 hover:bg-white/25 transition-colors"
          onClick={onEdit}
        >
          ✎ Edit
        </button>
      </div>

      {/* Scrubber */}
      <div className="absolute left-4 right-4 bottom-20">
        <div
          className="h-1 w-full bg-white/20 rounded-full cursor-pointer"
          onClick={handleProgressClick}
        >
          <div
            className="h-1 bg-white rounded-full transition-all duration-200"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-white/80">
          <span>{fmt(time)}</span>
          <span>{fmt(dur)}</span>
        </div>
      </div>

      {/* Transport controls */}
      <div className="absolute left-0 right-0 bottom-6 grid place-items-center gap-3">
        <div className="flex items-center gap-8 text-white">
          <button
            className="h-12 w-12 grid place-items-center rounded-full bg-white/15 border border-white/20 hover:bg-white/25 transition-colors"
            onClick={() => {
              const v = videoRef.current;
              if (!v) return;
              v.currentTime = Math.max(0, v.currentTime - 5);
            }}
            aria-label="Back 5s"
          >
            ◀
          </button>

          <button
            className="h-16 w-16 grid place-items-center rounded-full bg-white text-black font-bold hover:bg-white/90 transition-colors"
            onClick={() => {
              const v = videoRef.current;
              if (!v) return;
              v.paused ? v.play() : v.pause();
            }}
            aria-label="Play/Pause"
          >
            {playing ? "❚❚" : "▶"}
          </button>

          <button
            className="h-12 w-12 grid place-items-center rounded-full bg-white/15 border border-white/20 hover:bg-white/25 transition-colors"
            onClick={() => {
              const v = videoRef.current;
              if (!v || !dur) return;
              v.currentTime = Math.min(dur, v.currentTime + 5);
            }}
            aria-label="Forward 5s"
          >
            ▶
          </button>
        </div>

        {/* See more chevron */}
        <div className="text-[11px] tracking-wide text-white/80 mt-3">
          See More
        </div>
      </div>

      {/* Loading veil when not ready */}
      {!ready && (
        <div className="absolute inset-0 grid place-items-center text-white/90 bg-black/40">
          Loading preview…
        </div>
      )}
    </div>
  );
}

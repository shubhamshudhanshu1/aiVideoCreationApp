"use client";

import { useState, useEffect } from "react";

interface YouTubePlayerProps {
  videoId: string;
  title: string;
  author: string;
  poster?: string;
  onLike?: () => void;
  onDislike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onCreateAgain?: () => void;
  onEdit?: () => void;
  onBack?: () => void;
  className?: string;
}

export default function YouTubePlayer({
  videoId,
  title,
  author,
  poster,
  onLike,
  onDislike,
  onComment,
  onShare,
  onCreateAgain,
  onEdit,
  onBack,
  className = "",
}: YouTubePlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load YouTube iframe API
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* YouTube iframe */}
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setIsLoaded(true)}
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

      {/* See more chevron */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <div className="text-[11px] tracking-wide text-white/80">See More</div>
      </div>

      {/* Loading veil when not ready */}
      {!isLoaded && (
        <div className="absolute inset-0 grid place-items-center text-white/90 bg-black/40">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading YouTube video...</p>
          </div>
        </div>
      )}
    </div>
  );
}

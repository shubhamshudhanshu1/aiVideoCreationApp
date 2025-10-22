"use client";
import { useState } from "react";
import Link from "next/link";

export default function MiniPlayer() {
  const [open] = useState(true);
  if (!open) return null;
  return (
    <div className="fixed left-0 right-0 bottom-16 sm:bottom-4 mx-auto max-w-2xl">
      <div className="card flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-black/10" />
          <div>
            <div className="text-sm font-medium">Girlfriend</div>
            <div className="text-xs text-mute">@DoggedInstrumentalists4834</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="iconbtn">▶</button>
          <Link className="chip" href="/watch/vid_123">
            Open
          </Link>
        </div>
      </div>
    </div>
  );
}

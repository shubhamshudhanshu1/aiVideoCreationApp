"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PlayerPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to demo video
    router.replace("/player/demo");
  }, [router]);

  return (
    <div className="h-screen w-full fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading video player...</p>
      </div>
    </div>
  );
}

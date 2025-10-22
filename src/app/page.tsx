import Link from "next/link";
import { Play, ThumbsUp, MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Content Cards Section */}
      <div className="px-4 py-6">
        {/* Video Cards Row */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-4">
          {/* Left Card (Partially Visible) */}
          <div className="flex-shrink-0 w-32 h-48 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 text-white text-sm">
                <Play size={16} />
                <span>12K</span>
              </div>
            </div>
          </div>

          {/* Center Card (Main Video) */}
          <div className="flex-shrink-0 w-64 h-48 bg-green-600 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-4 text-white text-sm">
                <div className="flex items-center gap-1">
                  <Play size={16} />
                  <span>52K</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp size={16} />
                  <span>35K</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle size={16} />
                  <span>32</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card (Partially Visible) */}
          <div className="flex-shrink-0 w-32 h-48 bg-gray-300 rounded-2xl flex items-center justify-center relative">
            <Play size={24} className="text-gray-600" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-1 text-gray-700 text-sm">
                <Play size={16} />
                <span>8K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Hero Card */}
        <div className="bg-gradient-to-b from-red-500 to-red-700 rounded-3xl p-6 mb-8 relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-white font-semibold text-lg">
              Perspectives
            </span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-400 rounded-full"></div>
              <span className="text-white text-sm">MaxuelLax</span>
            </div>
          </div>

          {/* Central Blue Circle */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-blue-400 rounded-full"></div>
          </div>

          {/* Person Silhouette */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 bg-black/20 rounded-full flex items-center justify-center">
              <div className="w-20 h-20 bg-black/30 rounded-full"></div>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-serif text-white leading-tight mb-2">
              Make your own music
            </h1>
            <p className="text-white/90 text-lg">
              Turn your ideas into anthems
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-black p-6">
        {/* Primary Button */}
        <Link
          href="/create"
          className="block w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white text-center py-4 rounded-2xl font-semibold text-lg mb-4"
        >
          Create a free account
        </Link>

        {/* Secondary Action */}
        <div className="text-center text-white/80">
          <span>Already have an account? </span>
          <Link href="/login" className="text-white underline">
            Sign in
          </Link>
        </div>

        {/* Home Indicator */}
        <div className="flex justify-center mt-4">
          <div className="w-32 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

"use client";

import VideoPlayer from "@/components/VideoPlayer";
import YouTubePlayer from "@/components/YouTubePlayer";

interface PlayerPageProps {
  params: {
    id: string;
  };
}

interface VideoData {
  title: string;
  author: string;
  poster: string;
  src: string;
  youtubeUrl?: string;
  isYouTube?: boolean;
}

// Mock video data - in a real app, this would come from an API
const getVideoData = (id: string): VideoData => {
  const videos = {
    demo: {
      title: "Girlfriend",
      author: "DoggedInstrumentalists4834",
      poster:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
      src: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    },
    "youtube-demo": {
      title: "YouTube Demo Video",
      author: "DemoChannel",
      poster:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop",
      src: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    },
    "music-video": {
      title: "Make Your Own Music",
      author: "MusicCreator",
      poster:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
      src: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    },
    "5Ga6mYydehw": {
      title: "YouTube Video - 5Ga6mYydehw",
      author: "YouTubeCreator",
      poster:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop",
      src: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      youtubeUrl: "https://www.youtube.com/watch?v=5Ga6mYydehw",
      isYouTube: true,
    },
  };

  return videos[id as keyof typeof videos] || videos.demo;
};

export default function PlayerPage({ params }: PlayerPageProps) {
  const videoData = getVideoData(params.id);

  // Check if it's a YouTube video
  if (videoData.isYouTube && videoData.youtubeUrl) {
    const videoId = videoData.youtubeUrl.split("v=")[1]?.split("&")[0];

    return (
      <div className="h-screen w-full fixed inset-0 z-50">
        <YouTubePlayer
          videoId={videoId || "5Ga6mYydehw"}
          title={videoData.title}
          author={videoData.author}
          poster={videoData.poster}
          onLike={() => console.log("Liked")}
          onDislike={() => console.log("Disliked")}
          onComment={() => console.log("Comment")}
          onShare={() => console.log("Shared")}
          onCreateAgain={() => console.log("Create Again")}
          onEdit={() => console.log("Edit")}
          onBack={() => window.history.back()}
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-full fixed inset-0 z-50">
      <VideoPlayer
        title={videoData.title}
        author={videoData.author}
        poster={videoData.poster}
        src={videoData.src}
        onLike={() => console.log("Liked")}
        onDislike={() => console.log("Disliked")}
        onComment={() => console.log("Comment")}
        onShare={() => console.log("Shared")}
        onCreateAgain={() => console.log("Create Again")}
        onEdit={() => console.log("Edit")}
        onBack={() => window.history.back()}
      />
    </div>
  );
}

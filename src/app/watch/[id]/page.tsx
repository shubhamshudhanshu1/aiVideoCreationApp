import VideoPlayer from "@/components/VideoPlayer";

interface WatchPageProps {
  params: {
    id: string;
  };
}

export default function WatchPage({ params }: WatchPageProps) {
  return (
    <VideoPlayer
      title="Girlfriend"
      author="DoggedInstrumentalists4834"
      poster="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop"
      src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
      onLike={() => console.log("Liked")}
      onDislike={() => console.log("Disliked")}
      onComment={() => console.log("Comment")}
      onShare={() => console.log("Shared")}
      onCreateAgain={() => console.log("Create Again")}
      onEdit={() => console.log("Edit")}
      onBack={() => window.history.back()}
    />
  );
}

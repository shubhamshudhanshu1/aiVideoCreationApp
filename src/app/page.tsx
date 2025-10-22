import MiniPlayer from "@/components/MiniPlayer";
import PageHeader from "@/components/PageHeader";
import VideoCard from "@/components/VideoCard";

const cards = [
  { id: "1", title: "Voicenotes I", plays: 728, likes: 24, comments: 1 },
  { id: "2", title: "Missing Piece", plays: 84000, likes: 1200, comments: 85 },
];

export default function Explore() {
  return (
    <>
      <PageHeader
        title="v4.5-all. Made for everyone."
        subtitle="Introducing the best free model — built to unlock creativity wherever video begins."
        badge={{ text: "NEW MODEL", variant: "brand" }}
        action={{
          text: "Create with v4.5-all",
          href: "/create",
          variant: "btn",
        }}
      />

      <h3 className="font-semibold mb-3">For You</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map((c) => (
          <VideoCard
            key={c.id}
            id={c.id}
            title={c.title}
            plays={c.plays}
            likes={c.likes}
            comments={c.comments}
          />
        ))}
      </div>

      <MiniPlayer />
    </>
  );
}

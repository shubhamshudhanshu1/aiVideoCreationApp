import VideoCard from "@/components/VideoCard";

const my = [
  {
    id: "a1",
    title: "Girlfriend",
    ver: "v4.5-all",
    tags: ["soul", "sad", "emotional"],
    lock: false,
  },
  {
    id: "a2",
    title: "My Girlfriend",
    ver: "v4.5-all",
    tags: ["nostalgic", "acoustic"],
    lock: false,
  },
  {
    id: "a3",
    title: "My Video Title",
    ver: "v5 preview",
    tags: ["pensive", "sad"],
    lock: true,
  },
];

export default function Library() {
  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Library</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {my.map((v) => (
          <VideoCard
            key={v.id}
            id={v.id}
            title={v.title}
            version={v.ver}
            tags={v.tags}
            locked={v.lock}
            variant="list"
          />
        ))}
      </div>
    </>
  );
}

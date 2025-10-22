import VideoPlayer from "@/components/VideoPlayer";

export default function Watch({ params }: { params: { id: string } }) {
  return (
    <div className="grid sm:grid-cols-[1fr,260px] gap-6">
      <VideoPlayer
        title="Girlfriend"
        author="DoggedInstrumentalists4834"
        duration="0:41"
        model="v4.5-all"
        remixId={params.id}
      />

      <aside className="card p-4">
        <div className="font-medium mb-2">Details</div>
        <div className="text-sm text-mute">Length 0:41 · Model v4.5-all</div>
        <div className="mt-4 font-medium">Comments</div>
        <div className="text-sm text-mute mt-2">No comments yet.</div>
      </aside>
    </div>
  );
}

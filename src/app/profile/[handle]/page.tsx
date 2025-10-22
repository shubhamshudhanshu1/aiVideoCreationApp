import UserAvatar from "@/components/UserAvatar";

export default function Profile({ params }: { params: { handle: string } }) {
  return (
    <div>
      <UserAvatar
        name="DoggedInstrumentalists4834"
        handle={params.handle}
        size="lg"
        showStats={true}
        stats={[
          { label: "VIDEOS", value: 0 },
          { label: "LIKES", value: 0 },
          { label: "PLAYS", value: 0 },
        ]}
        actions={[
          { text: "Edit", variant: "chip" },
          { text: "Share", variant: "chip" },
          { text: "Follow", variant: "btn" },
        ]}
        className="mb-6"
      />

      <div className="text-sm text-mute mb-2">Songs</div>
      <div className="card p-6 text-sm text-mute">No videos yet.</div>
    </div>
  );
}

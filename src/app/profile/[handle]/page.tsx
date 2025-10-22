import UserAvatar from "@/components/UserAvatar";
import { Music, Heart, Play, Edit, Share, Plus } from "lucide-react";

export default function Profile({ params }: { params: { handle: string } }) {
  return (
    <div>
      <UserAvatar
        name="DoggedInstrumentalists4834"
        handle={params.handle}
        size="lg"
        showStats={true}
        following={42}
        followers={128}
        stats={[
          {
            label: "SONGS",
            value: 12,
            icon: <Music size={16} className="text-mute" />,
          },
          {
            label: "LIKES",
            value: 89,
            icon: <Heart size={16} className="text-mute" />,
          },
          {
            label: "PLAYS",
            value: 234,
            icon: <Play size={16} className="text-mute" />,
          },
        ]}
        actions={[
          {
            text: "Edit",
            variant: "chip",
            icon: <Edit size={16} />,
          },
          {
            text: "Share",
            variant: "chip",
            icon: <Share size={16} />,
          },
          {
            text: "Add",
            variant: "btn",
            icon: <Plus size={16} />,
          },
        ]}
        className="mb-6"
      />

      <div className="text-sm text-mute mb-2">Songs</div>
      <div className="card p-6 text-sm text-mute">No videos yet.</div>
    </div>
  );
}

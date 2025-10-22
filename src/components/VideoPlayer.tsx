import ActionButtons from "./ActionButtons";

interface VideoPlayerProps {
  title: string;
  author: string;
  thumbnail?: string;
  duration?: string;
  model?: string;
  onLike?: () => void;
  onDislike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onRemix?: () => void;
  onEdit?: () => void;
  onPublish?: () => void;
  remixId?: string;
  className?: string;
}

export default function VideoPlayer({
  title,
  author,
  thumbnail,
  duration,
  model,
  onLike,
  onDislike,
  onComment,
  onShare,
  onRemix,
  onEdit,
  onPublish,
  remixId,
  className = "",
}: VideoPlayerProps) {
  return (
    <div className={`card overflow-hidden ${className}`}>
      <div className="aspect-video bg-black/10">
        {thumbnail && (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="p-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">{title}</div>
          <div className="text-xs text-mute">@{author}</div>
        </div>
        <div className="flex gap-2">
          <button className="iconbtn" onClick={onLike}>
            👍
          </button>
          <button className="iconbtn" onClick={onDislike}>
            👎
          </button>
          <button className="iconbtn" onClick={onComment}>
            💬
          </button>
          <button className="iconbtn" onClick={onShare}>
            ↻
          </button>
          <button className="iconbtn" onClick={onShare}>
            ↗
          </button>
        </div>
      </div>
      <div className="px-4 pb-4">
        <ActionButtons
          primary={{
            text: "Publish",
            onClick: onPublish,
            variant: "btn",
          }}
          secondary={[
            {
              text: "Create Again",
              href: remixId ? `/create?remix=${remixId}` : undefined,
              onClick: onRemix,
              variant: "chip",
            },
            {
              text: "Edit",
              onClick: onEdit,
              variant: "chip",
            },
          ]}
        />
      </div>
    </div>
  );
}

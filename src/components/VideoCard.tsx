import Link from "next/link";

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail?: string;
  plays?: number;
  likes?: number;
  comments?: number;
  author?: string;
  tags?: string[];
  version?: string;
  locked?: boolean;
  variant?: "grid" | "list" | "preview";
  href?: string;
}

export default function VideoCard({
  id,
  title,
  thumbnail,
  plays,
  likes,
  comments,
  author,
  tags,
  version,
  locked,
  variant = "grid",
  href,
}: VideoCardProps) {
  const cardHref = href || `/watch/${id}`;

  if (variant === "list") {
    return (
      <div className="card p-4 flex items-center gap-4">
        <div className="h-16 w-16 rounded-xl bg-black/10" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link className="font-medium hover:underline" href={cardHref}>
              {title}
            </Link>
            {version && <span className="chip">{version}</span>}
            {locked && <span className="chip">Locked</span>}
          </div>
          {tags && (
            <div className="text-xs text-mute mt-1">{tags.join(", ")}</div>
          )}
        </div>
        <Link className="chip" href={cardHref}>
          Open
        </Link>
      </div>
    );
  }

  if (variant === "preview") {
    return (
      <div className="card p-5">
        <div className="h-64 bg-black/10 rounded-xl mb-4 grid place-items-center">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            "Preview"
          )}
        </div>
        <div className="flex gap-2">
          <button className="chip">Create Again</button>
          <button className="chip">Edit</button>
          <button className="chip">Publish</button>
        </div>
      </div>
    );
  }

  // Default grid variant
  return (
    <Link href={cardHref} className="card overflow-hidden">
      <div className="h-40 bg-black/10" />
      <div className="p-4">
        <div className="font-medium">{title}</div>
        {author && <div className="text-xs text-mute">@{author}</div>}
        {(plays !== undefined ||
          likes !== undefined ||
          comments !== undefined) && (
          <div className="text-xs text-mute flex gap-3 mt-1">
            {plays !== undefined && <span>▶ {plays.toLocaleString()}</span>}
            {likes !== undefined && <span>👍 {likes.toLocaleString()}</span>}
            {comments !== undefined && (
              <span>💬 {comments.toLocaleString()}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

interface UserAvatarProps {
  name: string;
  handle: string;
  avatar?: string;
  size?: "sm" | "md" | "lg";
  showStats?: boolean;
  stats?: Array<{
    label: string;
    value: number;
  }>;
  actions?: Array<{
    text: string;
    href?: string;
    onClick?: () => void;
    variant?: "btn" | "chip";
  }>;
  className?: string;
}

export default function UserAvatar({
  name,
  handle,
  avatar,
  size = "md",
  showStats = false,
  stats = [],
  actions = [],
  className = "",
}: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-20 w-20",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={`card p-6 flex items-center gap-4 ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-tr from-brand to-pink-400`}
      >
        {avatar && (
          <img
            src={avatar}
            alt={name}
            className="w-full h-full rounded-full object-cover"
          />
        )}
      </div>
      <div className="flex-1">
        <div className={`${textSizes[size]} font-semibold`}>{name}</div>
        <div className="text-mute">@{handle}</div>
        {showStats && stats.length > 0 && (
          <div className="mt-3 flex gap-2 text-sm">
            {stats.map((stat, index) => (
              <span key={index} className="chip">
                {stat.value} {stat.label}
              </span>
            ))}
          </div>
        )}
      </div>
      {actions.length > 0 && (
        <div className="flex gap-2">
          {actions.map((action, index) => {
            const baseClass = action.variant === "btn" ? "btn" : "chip";
            const content = action.text;

            if (action.href) {
              return (
                <a key={index} href={action.href} className={baseClass}>
                  {content}
                </a>
              );
            }

            return (
              <button
                key={index}
                className={baseClass}
                onClick={action.onClick}
              >
                {content}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

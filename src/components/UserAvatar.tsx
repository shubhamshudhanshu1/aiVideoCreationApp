import {
  Music,
  Heart,
  Play,
  Edit,
  Share,
  Plus,
  UserPlus,
  Users,
} from "lucide-react";

interface UserAvatarProps {
  name: string;
  handle: string;
  avatar?: string;
  size?: "sm" | "md" | "lg";
  showStats?: boolean;
  stats?: Array<{
    label: string;
    value: number;
    icon?: React.ReactNode;
  }>;
  actions?: Array<{
    text: string;
    href?: string;
    onClick?: () => void;
    variant?: "btn" | "chip";
    icon?: React.ReactNode;
  }>;
  following?: number;
  followers?: number;
  containerClassName?: string;
}

export default function UserAvatar({
  name,
  handle,
  avatar,
  size = "md",
  showStats = false,
  stats = [],
  actions = [],
  following = 0,
  followers = 0,
  containerClassName = "",
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
    <div className={`space-y-4 ${containerClassName}`}>
      {/* Main Profile Card */}
      <div className="card p-6">
        <div className="flex items-center gap-4">
          <div
            className={`${sizeClasses[size]} rounded-full bg-gradient-to-tr from-brand to-pink-400 flex-shrink-0`}
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
          </div>
        </div>

        {/* Following/Followers Row */}
        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-mute" />
            <div className="text-sm">
              <div className="font-semibold">{following}</div>
              <div className="text-mute text-xs">Following</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UserPlus size={16} className="text-mute" />
            <div className="text-sm">
              <div className="font-semibold">{followers}</div>
              <div className="text-mute text-xs">Followers</div>
            </div>
          </div>
        </div>

        {/* Stats with Icons */}
        {showStats && stats.length > 0 && (
          <div className="mt-4 flex gap-3">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2 chip">
                {stat.icon}
                <span className="text-sm">
                  <span className="font-semibold">{stat.value}</span>{" "}
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons Row */}
      {actions.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {actions.map((action, index) => {
            const baseClass = action.variant === "btn" ? "btn" : "chip";
            const content = (
              <div className="flex items-center justify-center gap-2">
                {action.icon}
                {action.text}
              </div>
            );

            if (action.href) {
              return (
                <a
                  key={index}
                  href={action.href}
                  className={`${baseClass} w-full flex justify-center`}
                >
                  {content}
                </a>
              );
            }

            return (
              <button
                key={index}
                className={`${baseClass} w-full flex justify-center`}
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

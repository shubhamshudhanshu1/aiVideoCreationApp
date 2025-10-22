interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: "brand" | "default";
  };
  action?: {
    text: string;
    href?: string;
    onClick?: () => void;
    variant?: "btn" | "chip";
  };
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  badge,
  action,
  className = "",
}: PageHeaderProps) {
  return (
    <section
      className={`card p-5 mb-6 flex items-center justify-between ${className}`}
    >
      <div>
        {badge && (
          <div
            className={`text-xs chip mb-2 ${
              badge.variant === "brand" ? "bg-brand text-brand-fg border-0" : ""
            }`}
          >
            {badge.text}
          </div>
        )}
        <h2 className="text-xl font-semibold">{title}</h2>
        {subtitle && <p className="text-sm text-mute">{subtitle}</p>}
      </div>
      {action && (
        <a
          href={action.href}
          className={action.variant === "btn" ? "btn" : "chip"}
          onClick={action.onClick}
        >
          {action.text}
        </a>
      )}
    </section>
  );
}

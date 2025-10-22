import Link from "next/link";

interface ActionButtonsProps {
  primary?: {
    text: string;
    href?: string;
    onClick?: () => void;
    variant?: "btn" | "chip";
  };
  secondary?: Array<{
    text: string;
    href?: string;
    onClick?: () => void;
    variant?: "btn" | "chip";
  }>;
  className?: string;
}

export default function ActionButtons({
  primary,
  secondary = [],
  className = "",
}: ActionButtonsProps) {
  const renderButton = (button: any, key?: string) => {
    const baseClass = button.variant === "btn" ? "btn" : "chip";
    const content = button.text;

    if (button.href) {
      return (
        <Link key={key} href={button.href} className={baseClass}>
          {content}
        </Link>
      );
    }

    return (
      <button key={key} className={baseClass} onClick={button.onClick}>
        {content}
      </button>
    );
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {primary && renderButton(primary)}
      {secondary.map((button, index) => renderButton(button, index.toString()))}
    </div>
  );
}

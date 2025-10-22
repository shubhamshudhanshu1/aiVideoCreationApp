import Link from "next/link";
import { ReactNode } from "react";

// Button variant types
export type ButtonVariant = "btn" | "chip" | "outline" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type ButtonLayout = "horizontal" | "vertical" | "grid";
export type ButtonWidth =
  | "auto"
  | "full"
  | "fit"
  | "min"
  | "max"
  | "1/2"
  | "1/3"
  | "2/3"
  | "1/4"
  | "3/4";
export type BorderStyle =
  | "solid"
  | "dashed"
  | "dotted"
  | "double"
  | "none"
  | "hidden";
export type BorderWidth = "0" | "1" | "2" | "4" | "8";
export type TextAlign = "left" | "center" | "right" | "justify";

// Individual button configuration
export interface ButtonConfig {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  fullWidth?: boolean;
  width?: ButtonWidth;
  borderStyle?: BorderStyle;
  borderWidth?: BorderWidth;
  borderColor?: string;
  textAlign?: TextAlign;
}

// Main component props
export interface ActionButtonsProps {
  // Primary action (main button)
  primary?: ButtonConfig;

  // Secondary actions (array of buttons)
  secondary?: ButtonConfig[];

  // Layout configuration
  layout?: ButtonLayout;
  gap?: "sm" | "md" | "lg" | "xl";

  // Container styling
  containerClassName?: string;

  // Global button styling overrides
  buttonClassName?: string;

  // Alignment
  align?: "left" | "center" | "right" | "stretch";

  // Responsive behavior
  responsive?: boolean;

  // Spacing
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
}

export default function ActionButtons({
  primary,
  secondary = [],
  layout = "horizontal",
  gap = "md",
  containerClassName = "",
  buttonClassName = "",
  align = "left",
  responsive = true,
  spacing = "md",
}: ActionButtonsProps) {
  // Size configurations - use CSS classes that preserve .btn base styles
  const sizeClasses = {
    sm: "btn-size-sm",
    md: "btn-size-md",
    lg: "btn-size-lg",
    xl: "btn-size-xl",
    "2xl": "btn-size-2xl",
    "3xl": "btn-size-3xl",
  };

  // Width configurations
  const widthClasses = {
    auto: "w-auto",
    full: "w-full",
    fit: "w-fit",
    min: "w-min",
    max: "w-max",
    "1/2": "w-1/2",
    "1/3": "w-1/3",
    "2/3": "w-2/3",
    "1/4": "w-1/4",
    "3/4": "w-3/4",
  };

  // Border style configurations
  const borderStyleClasses = {
    solid: "border-solid",
    dashed: "border-dashed",
    dotted: "border-dotted",
    double: "border-double",
    none: "border-none",
    hidden: "border-hidden",
  };

  // Border width configurations
  const borderWidthClasses = {
    "0": "border-0",
    "1": "border",
    "2": "border-2",
    "4": "border-4",
    "8": "border-8",
  };

  // Text alignment configurations
  const textAlignClasses = {
    left: "btn-text-left",
    center: "btn-text-center",
    right: "btn-text-right",
    justify: "btn-text-justify",
  };

  // Variant configurations
  const variantClasses = {
    btn: "btn",
    chip: "chip",
    outline:
      "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    link: "bg-transparent text-blue-600 hover:text-blue-800 underline",
  };

  // Gap configurations
  const gapClasses = {
    sm: "gap-1",
    md: "gap-2",
    lg: "gap-4",
    xl: "gap-6",
  };

  // Layout configurations
  const layoutClasses = {
    horizontal: "flex-row",
    vertical: "flex-col",
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  };

  // Alignment configurations
  const alignClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    stretch: "justify-stretch",
  };

  // Spacing configurations
  const spacingClasses = {
    none: "",
    sm: "py-2",
    md: "py-4",
    lg: "py-6",
    xl: "py-8",
  };

  // Render individual button
  const renderButton = (button: ButtonConfig, index?: string | number) => {
    const {
      text,
      href,
      onClick,
      variant = "btn",
      size = "md",
      disabled = false,
      loading = false,
      icon,
      iconPosition = "left",
      className = "",
      fullWidth = false,
      width = "auto",
      borderStyle = "solid",
      borderWidth = "1",
      borderColor,
      textAlign = "center",
    } = button;

    const baseClasses = variantClasses[variant];
    const sizeClass = sizeClasses[size];
    const widthClass = fullWidth ? "w-full" : widthClasses[width];
    const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";
    const loadingClass = loading ? "cursor-wait" : "";
    const borderStyleClass = borderStyleClasses[borderStyle];
    const borderWidthClass = borderWidthClasses[borderWidth];
    const borderColorClass = borderColor ? `border-${borderColor}` : "";
    const textAlignClass = textAlignClasses[textAlign];

    // Ensure base classes are preserved and custom classes are applied properly
    const buttonClasses = [
      baseClasses, // This includes .btn or .chip base class
      sizeClass, // Size overrides with !important
      widthClass, // Width classes
      borderStyleClass, // Border style
      borderWidthClass, // Border width
      borderColorClass, // Border color
      textAlignClass, // Text alignment
      disabledClass, // Disabled state
      loadingClass, // Loading state
      buttonClassName, // Global button overrides
      className, // Individual button overrides
    ]
      .filter(Boolean)
      .join(" ");

    const iconElement = icon && (
      <span className={iconPosition === "left" ? "mr-2" : "ml-2"}>{icon}</span>
    );

    const content = (
      <>
        {loading && (
          <span className="mr-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
        {icon && iconPosition === "left" && iconElement}
        {text}
        {icon && iconPosition === "right" && iconElement}
      </>
    );

    if (href && !disabled) {
      return (
        <Link key={index} href={href} className={buttonClasses}>
          {content}
        </Link>
      );
    }

    return (
      <button
        key={index}
        className={buttonClasses}
        onClick={disabled || loading ? undefined : onClick}
        disabled={disabled || loading}
      >
        {content}
      </button>
    );
  };

  // Container classes
  const containerClasses = [
    "flex",
    layoutClasses[layout],
    gapClasses[gap],
    alignClasses[align],
    spacingClasses[spacing],
    responsive ? "flex-wrap" : "",
    containerClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses}>
      {primary && renderButton(primary, "primary")}
      {secondary.map((button, index) =>
        renderButton(button, `secondary-${index}`)
      )}
    </div>
  );
}

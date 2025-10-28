"use client";

interface ToggleSwitchProps {
  leftOption: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  };
  rightOption: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  };
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function ToggleSwitch({
  leftOption,
  rightOption,
  value,
  onChange,
  className = "",
}: ToggleSwitchProps) {
  const isLeftSelected = value === leftOption.value;

  return (
    <div className={`relative ${className}`}>
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => onChange(leftOption.value)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            isLeftSelected
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {leftOption.icon}
          {leftOption.label}
        </button>
        <button
          type="button"
          onClick={() => onChange(rightOption.value)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            !isLeftSelected
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {rightOption.icon}
          {rightOption.label}
        </button>
      </div>
    </div>
  );
}

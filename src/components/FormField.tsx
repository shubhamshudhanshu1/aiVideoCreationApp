"use client";

interface FormFieldProps {
  label: string;
  type?: "text" | "number" | "email" | "password" | "textarea" | "select";
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  rows?: number;
  className?: string;
  required?: boolean;
}

export default function FormField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  options,
  min,
  max,
  rows = 3,
  className = "",
  required = false,
}: FormFieldProps) {
  const inputId = `input-${label.toLowerCase().replace(/\s+/g, "-")}`;

  const renderInput = () => {
    const baseClass = `input ${className}`;

    switch (type) {
      case "textarea":
        return (
          <textarea
            id={inputId}
            className={`${baseClass} h-32`}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            rows={rows}
            required={required}
          />
        );

      case "select":
        return (
          <select
            id={inputId}
            className={baseClass}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            required={required}
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            id={inputId}
            type={type}
            className={baseClass}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            min={min}
            max={max}
            required={required}
          />
        );
    }
  };

  return (
    <div>
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      {renderInput()}
    </div>
  );
}

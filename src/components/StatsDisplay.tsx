interface StatsDisplayProps {
  stats: Array<{
    label: string;
    value: number;
    icon?: string;
  }>;
  className?: string;
}

export default function StatsDisplay({
  stats,
  className = "",
}: StatsDisplayProps) {
  return (
    <div className={`flex gap-2 text-sm ${className}`}>
      {stats.map((stat, index) => (
        <span key={index} className="chip">
          {stat.icon && <span className="mr-1">{stat.icon}</span>}
          {stat.value.toLocaleString()} {stat.label}
        </span>
      ))}
    </div>
  );
}

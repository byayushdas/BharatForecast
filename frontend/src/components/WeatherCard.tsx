import type { ReactNode } from "react";

interface WeatherCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: "up" | "down" | "stable";
}

export default function WeatherCard({ title, value, unit, subtitle, icon }: WeatherCardProps) {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300">
      <div className="flex items-center gap-3 text-text-secondary mb-3">
        {icon}
        <h3 className="font-medium text-sm uppercase tracking-wider">{title}</h3>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-semibold text-text-primary">{value}</span>
        {unit && <span className="text-lg text-text-secondary">{unit}</span>}
      </div>
      {subtitle && (
        <p className="text-sm text-text-secondary mt-2">{subtitle}</p>
      )}
    </div>
  );
}

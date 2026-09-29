import type { ReactNode } from 'react';
interface Props { title: string; value: string | number; unit?: string; subtitle: string; icon: ReactNode; tone?: string }
export default function WeatherCard({ title, value, unit, subtitle, icon, tone = 'blue' }: Props) {
  return <article className="metric-card"><div className="metric-top"><span>{title}</span><span className={`metric-icon ${tone}`}>{icon}</span></div><div className="metric-value">{value}<span>{unit}</span></div><p>{subtitle}</p></article>;
}

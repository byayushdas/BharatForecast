import { Orbit } from 'lucide-react';
import { formatIST, modelColors } from '../lib/format';

interface Props { weights: Record<string, number>; locationName: string; variable: string; runTime: string; leadTime: string; modelVersion?: string }
export default function ModelWeights({ weights, locationName, variable, runTime, leadTime }: Props) {
  const entries = Object.entries(weights).sort(([, a], [, b]) => b - a);
  return <section className="panel model-weights">
    <div className="panel-heading"><div><h2>Inside the blend</h2><p>Every model brings a perspective.</p></div><Orbit size={20} className="muted-icon" /></div>
    <div className="weight-stack" aria-label="Model contribution proportions">{entries.filter(([, value]) => value > 0).map(([name, value]) => <span key={name} style={{ flex: value, background: modelColors[name] || '#8493ac' }} />)}</div>
    <div className="weight-rows">{entries.map(([name, value]) => <div className="weight-row" key={name}><span className="model-color" style={{ background: modelColors[name] || '#8493ac' }} /><strong>{name}</strong><span className="weight-type">{name === 'AIFS' ? 'AI model' : name === 'GEFS' ? 'Ensemble' : 'Physical model'}</span><span className="weight-percent">{Math.round(value * 100)}<small>%</small></span></div>)}</div>
    <div className="blend-context"><span>{locationName} · {variable.toLowerCase()} · {leadTime}</span><span>Run: {formatIST(runTime)} IST</span></div>
  </section>;
}

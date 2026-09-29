import { ArrowDownRight, ArrowUpRight, Orbit } from 'lucide-react';
import type { ModelForecast } from '../types/weather';
import { modelColors, number } from '../lib/format';

interface Props { models: ModelForecast[]; variable: string; missingSources?: string[] }
export default function ModelComparison({ models, variable, missingSources = [] }: Props) {
  const blend = models.find(model => model.model === 'BLEND');
  return <section className="panel comparison-panel"><div className="panel-heading"><div><h2>A second opinion. And a third.</h2><p>{variable} estimates from each source model</p></div><span className="count-badge">{models.filter(m => m.model !== 'BLEND').length} models</span></div>
    <div className="table-scroll"><table className="model-table"><caption className="sr-only">Model comparison for {variable}. Difference is relative to the Bharat Blend.</caption><thead><tr><th scope="col">SOURCE MODEL</th><th scope="col">FORECAST</th><th scope="col">VS. BLEND</th></tr></thead><tbody>{models.filter(model => model.model !== 'BLEND').map(model => {
      const diff = blend ? model.value - blend.value : undefined;
      return <tr key={model.model}><td><div className="model-name"><span className="model-color" style={{ background: modelColors[model.model] }} /><strong>{model.model}</strong><span className="model-type">{model.isAi ? 'AI' : model.isEnsemble ? 'Ensemble' : 'NWP'}</span></div></td><td>{number(model.value)} <small>{model.unit}</small></td><td><span className="model-difference">{diff !== undefined && diff !== 0 && (diff > 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />)}{diff === undefined ? '—' : `${diff > 0 ? '+' : ''}${number(diff)}`}</span></td></tr>;
    })}{missingSources.map(source => <tr key={source} className="missing-source"><td>{source}<span className="model-type">Unavailable</span></td><td>—</td><td>—</td></tr>)}</tbody>{blend && <tfoot><tr><td><div className="model-name"><Orbit size={16} /><strong>Bharat Blend</strong></div></td><td>{number(blend.value)} <small>{blend.unit}</small></td><td>Reference</td></tr></tfoot>}</table></div>
    {missingSources.length > 0 && <p className="table-note">Unavailable sources have no contribution to this blend.</p>}
  </section>;
}

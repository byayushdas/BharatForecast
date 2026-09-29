import { ArrowRight, FlaskConical, Orbit } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { modelColors } from '../lib/format';

const sources = [
  { name: 'GFS', provider: 'NOAA · Physical model', description: 'A deterministic global forecast, offering one view of how the atmosphere may evolve.' },
  { name: 'GEFS', provider: 'NOAA · Ensemble', description: 'Multiple forecast members help describe the spread of possible weather outcomes.' },
  { name: 'IFS', provider: 'ECMWF · Physical model', description: 'A numerical weather prediction system that contributes another independent perspective.' },
  { name: 'AIFS', provider: 'ECMWF · AI model', description: 'A data-driven approach to weather forecasting, alongside traditional physical models.' },
];
export default function About() {
  const [params] = useSearchParams();
  return <>
    <div className="topbar"><div className="breadcrumb">Workspace <span>/</span><strong>Our methodology</strong></div><span className="prototype-badge"><FlaskConical size={13} /> Experimental preview</span></div>
    <div className="page-content about-page">
      <header className="page-heading"><div><div className="eyebrow">THE THINKING BEHIND THE FORECAST</div><h1>Better together<span className="heading-dot">.</span></h1><p>Understanding the idea behind Bharat Forecast.</p></div></header>
      <section className="about-hero"><div><span className="eyebrow">INTRODUCING BHARAT BLEND</span><h2>Many models.<br />One clearer outlook for India.</h2><p>India’s weather is wonderfully complex. Bharat Forecast explores how physical, ensemble, and AI weather models can be brought together into a local outlook—with the differences and uncertainty kept in view.</p><Link to={`/forecast?${params}`} className="button button-primary">Explore a forecast <ArrowRight size={15} /></Link></div><div className="about-orbit" aria-hidden="true"><Orbit size={175} strokeWidth={.65} /></div></section>
      <div className="methodology-intro"><h2>Four perspectives on the atmosphere.</h2><p>These are the source systems represented in the prototype. Demo values are illustrative, not downloads from these providers.</p></div>
      <div className="about-grid">{sources.map(source => <article className="panel source-card" key={source.name}><i className="model-color" style={{ background: modelColors[source.name] }} /><h3>{source.name}</h3><span>{source.provider}</span><p>{source.description}</p></article>)}</div>
      <section><div className="methodology-intro"><h2>From global models to a local perspective.</h2><p>The proposed pipeline aligns forecasts, assigns context-dependent contributions, and explains the resulting outlook.</p></div><div className="method-steps">
        <article className="panel method-step"><span className="step-number">01 / ALIGN</span><h3>Start on common ground</h3><p>Bring sources onto consistent locations, forecast intervals, variables, and units. Historical observations would support future bias correction.</p></article>
        <article className="panel method-step"><span className="step-number">02 / BLEND</span><h3>Make each contribution visible</h3><p>Combine available sources with explicit weights. The prototype uses example weights; adaptive weighting remains part of the planned system.</p></article>
        <article className="panel method-step"><span className="step-number">03 / UNDERSTAND</span><h3>Keep uncertainty in view</h3><p>Compare individual models with the blend and inspect the reported range. Verification against observations is planned, not yet established.</p></article>
      </div></section>
      <section className="about-status"><h3><FlaskConical size={18} />A transparent work in progress</h3><p>This is a research prototype. Synthetic data, example confidence labels, and demo advisories are not validated forecasts. Live ingestion, learned blending, and historical verification are future work. Always consult the <a href="https://mausam.imd.gov.in/" target="_blank" rel="noreferrer">India Meteorological Department</a> for official warnings.</p></section>
    </div>
  </>;
}

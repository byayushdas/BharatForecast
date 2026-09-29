import { Link, NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, ChartNoAxesCombined, ChevronRight, CloudSun, FlaskConical, LayoutDashboard, MapPin, Menu, Orbit, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [openAt, setOpenAt] = useState<string | null>(null);
  const [params] = useSearchParams();
  const location = useLocation();
  const open = openAt === location.key;
  const setOpen = (value: boolean) => setOpenAt(value ? location.key : null);
  const query = params.toString() ? `?${params}` : '';
  const activeCity = params.get('location') || 'kolkata';
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpenAt(null); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  return <>
    <header className="mobile-header"><Link to={`/${query}`} className="brand"><span className="brand-mark"><CloudSun size={24} /></span><span>Bharat<span className="brand-light">Forecast</span></span></Link><button className="icon-button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></header>
    {open && <button className="nav-backdrop" aria-label="Close navigation" onClick={() => setOpen(false)} />}
    <aside id="main-navigation" className={`sidebar ${open ? 'is-open' : ''}`}>
      <Link to={`/${query}`} className="brand desktop-brand"><span className="brand-mark"><CloudSun size={26} strokeWidth={1.8} /></span><span>Bharat<span className="brand-light">Forecast</span><small>WEATHER, IN PERSPECTIVE.</small></span></Link>
      <div className="workspace-label"><span className="india-dot" /> INDIA WORKSPACE <span className="version">BETA</span></div>
      <span className="nav-caption">EXPLORE</span>
      <nav className="main-nav" aria-label="Main navigation">
        <NavLink end to={`/${query}`}><LayoutDashboard size={18} />Overview<ChevronRight className="nav-arrow" size={15} /></NavLink>
        <NavLink to={`/forecast${query}`}><ChartNoAxesCombined size={18} />Forecast explorer<ChevronRight className="nav-arrow" size={15} /></NavLink>
        <NavLink to={`/about${query}`}><Orbit size={18} />Our methodology<ChevronRight className="nav-arrow" size={15} /></NavLink>
      </nav>
      <div className="locations-nav"><span className="nav-caption">QUICK LOCATIONS</span>
        {[['kolkata', 'Kolkata'], ['delhi', 'Delhi'], ['mumbai', 'Mumbai'], ['bengaluru', 'Bengaluru']].map(([id, name]) => {
          const cityParams = new URLSearchParams(params); cityParams.set('location', id);
          return <Link key={id} className={activeCity === id && location.pathname !== '/about' ? 'city-link selected' : 'city-link'} to={`${location.pathname === '/forecast' ? '/forecast' : '/'}?${cityParams}`}><MapPin size={15} />{name}{activeCity === id && <span className="city-dot" />}</Link>;
        })}
      </div>
      <div className="sidebar-bottom"><div className="blend-note"><span className="blend-note-icon"><Orbit size={21} /></span><h3>Many models.<br />One clearer picture.</h3><p>Physical and AI forecasts, brought together for India.</p><Link to={`/about${query}`}>Meet the Bharat Blend <ArrowUpRight size={14} /></Link></div><div className="sidebar-status"><FlaskConical size={14} /><span>Research prototype</span><span>v0.1</span></div></div>
    </aside>
  </>;
}

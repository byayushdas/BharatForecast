import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';

const Home = lazy(() => import('./pages/Home'));
const Forecast = lazy(() => import('./pages/Forecast'));
const About = lazy(() => import('./pages/About'));
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false } } });

function Workspace() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Navbar />
    <main id="main-content" className="workspace" tabIndex={-1}>
      <Suspense fallback={<div className="page-loading" role="status"><span className="loading-orbit" />Preparing your outlook…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<div className="empty-state"><span className="eyebrow">404 / OFF THE MAP</span><h1>This view hasn’t been forecast.</h1><p>Let’s get you back to familiar ground.</p><Link className="button button-primary" to="/">Back to overview</Link></div>} />
        </Routes>
      </Suspense>
    </main>
  </div>;
}
export default function App() {
  return <QueryClientProvider client={queryClient}><BrowserRouter><Workspace /></BrowserRouter></QueryClientProvider>;
}

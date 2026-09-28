import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/Navbar";

const Home = lazy(() => import("./pages/Home"));
const Forecast = lazy(() => import("./pages/Forecast"));
const About = lazy(() => import("./pages/About"));

const queryClient = new QueryClient();
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          {USE_MOCK_DATA && (
            <div className="bg-blue-50 text-blue-800 text-center py-2 text-sm font-medium border-b border-blue-200 flex items-center justify-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              DEMO MODE: Using local mock data. These are not real-time forecasts.
            </div>
          )}
          <main className="flex-1 overflow-x-hidden">
            <Suspense fallback={<div className="flex items-center justify-center h-[50vh]">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/forecast" element={<Forecast />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={
                  <div className="flex flex-col items-center justify-center h-[50vh]">
                    <h1 className="text-2xl font-semibold mb-4">Page not found</h1>
                    <Link to="/" className="text-primary hover:underline">Back to dashboard</Link>
                  </div>
                } />
              </Routes>
            </Suspense>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

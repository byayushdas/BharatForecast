import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/Navbar";

const Home = lazy(() => import("./pages/Home"));
const Forecast = lazy(() => import("./pages/Forecast"));
const About = lazy(() => import("./pages/About"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
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

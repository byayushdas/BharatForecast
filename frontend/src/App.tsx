import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Forecast from "./pages/Forecast";
import About from "./pages/About";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center h-[50vh]">
                  <h1 className="text-2xl font-semibold mb-4">Page not found</h1>
                  <a href="/" className="text-primary hover:underline">Back to dashboard</a>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

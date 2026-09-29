import { ArrowDown } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-semibold text-text-primary mb-8 text-center">About Bharat Forecast</h1>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">What is Bharat Forecast?</h2>
          <div className="prose prose-slate text-text-secondary leading-relaxed">
            <p>
              Bharat Forecast is a prototype for dynamically combining multiple weather forecasting systems. 
              Instead of relying on a single weather model, it ingests forecasts from multiple leading global 
              models and uses Artificial Intelligence to learn how to optimally blend them for specific locations 
              and weather variables across India.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Forecast Sources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface border border-border p-4 rounded-lg">
              <h3 className="font-medium text-text-primary">NOAA GFS</h3>
              <p className="text-sm text-text-secondary mt-1">Global Forecast System (Deterministic)</p>
            </div>
            <div className="bg-surface border border-border p-4 rounded-lg">
              <h3 className="font-medium text-text-primary">NOAA GEFS</h3>
              <p className="text-sm text-text-secondary mt-1">Global Ensemble Forecast System</p>
            </div>
            <div className="bg-surface border border-border p-4 rounded-lg">
              <h3 className="font-medium text-text-primary">ECMWF IFS</h3>
              <p className="text-sm text-text-secondary mt-1">Integrated Forecasting System</p>
            </div>
            <div className="bg-surface border border-border p-4 rounded-lg">
              <h3 className="font-medium text-text-primary">ECMWF AIFS</h3>
              <p className="text-sm text-text-secondary mt-1">Artificial Intelligence Forecasting System</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text-primary mb-6">How it works</h2>
          <div className="flex flex-col items-center max-w-sm mx-auto space-y-2">
            <div className="w-full bg-surface border border-border p-3 text-center rounded-lg font-medium">
              Multiple Models
            </div>
            <ArrowDown className="text-text-secondary" />
            <div className="w-full bg-surface border border-border p-3 text-center rounded-lg font-medium">
              Data Alignment
            </div>
            <ArrowDown className="text-text-secondary" />
            <div className="w-full bg-surface border border-border p-3 text-center rounded-lg font-medium">
              Bias Correction
            </div>
            <ArrowDown className="text-text-secondary" />
            <div className="w-full bg-primary-light text-primary border border-primary/20 p-3 text-center rounded-lg font-medium">
              Adaptive Weighting
            </div>
            <ArrowDown className="text-text-secondary" />
            <div className="w-full bg-primary text-white border border-primary p-3 text-center rounded-lg font-medium shadow-md">
              Blended Forecast
            </div>
            <ArrowDown className="text-text-secondary" />
            <div className="w-full bg-surface border border-border p-3 text-center rounded-lg font-medium">
              Verification
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Verification Data</h2>
          <div className="prose prose-slate text-text-secondary leading-relaxed mb-4">
            <p>
              The planned system continuously evaluates its own performance against historical and real-time ground truth data, using sources such as:
            </p>
          </div>
          <ul className="list-disc list-inside text-text-secondary space-y-2 ml-2">
            <li>IMD observations</li>
            <li>NASA IMERG rainfall estimates</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Technology</h2>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Tailwind CSS', 'Python / FastAPI', 'scikit-learn', 'Xarray', 'PostgreSQL / PostGIS', 'Docker'].map(tech => (
              <span key={tech} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {tech}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

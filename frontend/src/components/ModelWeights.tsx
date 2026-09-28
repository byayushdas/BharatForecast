import { memo } from 'react';

interface ModelWeightsProps {
  weights: Record<string, number>;
  locationName: string;
  variable: string;
  runTime: string;
  leadTime: string;
  modelVersion?: string;
}

const ModelWeights = memo(function ModelWeights({ weights, locationName, variable, runTime, leadTime, modelVersion }: ModelWeightsProps) {
  // Sort weights descending
  const sortedWeights = Object.entries(weights).sort(([, a], [, b]) => b - a);

  return (
    <div className="bg-surface rounded-xl border border-border p-5 shadow-sm h-full flex flex-col transition-all duration-200 hover:shadow-md hover:border-gray-300">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-text-primary">Model Contributions</h3>
        <p className="text-sm text-text-secondary mt-1">
          Weights represent the contribution assigned to each available forecast source for this forecast context.
        </p>
      </div>

      <div className="space-y-4 flex-1">
        {sortedWeights.map(([model, weight]) => {
          const percentage = (weight * 100).toFixed(0);
          return (
            <div key={model}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-text-primary">{model}</span>
                <span className="text-text-secondary">{percentage}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 gap-y-2 text-xs">
        <div className="text-text-secondary">Location</div>
        <div className="text-right font-medium text-text-primary">{locationName}</div>
        
        <div className="text-text-secondary">Variable</div>
        <div className="text-right font-medium text-text-primary">{variable}</div>
        
        <div className="text-text-secondary">Lead time</div>
        <div className="text-right font-medium text-text-primary">{leadTime}</div>
        
        <div className="text-text-secondary">Model run</div>
        <div className="text-right font-medium text-text-primary">
          {new Date(runTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
        </div>

        {modelVersion && (
          <>
            <div className="text-text-secondary">Model version</div>
            <div className="text-right font-medium text-text-primary">{modelVersion}</div>
          </>
        )}
      </div>
    </div>
  );
});

export default ModelWeights;

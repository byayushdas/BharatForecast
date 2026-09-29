import type { ModelForecast } from "../types/weather";
import clsx from "clsx";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface ModelComparisonProps {
  models: ModelForecast[];
  variable: string;
  missingSources?: string[];
}

export default function ModelComparison({ models, variable, missingSources = [] }: ModelComparisonProps) {
  const [hiddenModels, setHiddenModels] = useState<Set<string>>(new Set());
  
  const blendModel = models.find(m => m.model === "BLEND");
  const otherModels = models.filter(m => m.model !== "BLEND");

  const toggleVisibility = (modelName: string) => {
    setHiddenModels(prev => {
      const next = new Set(prev);
      if (next.has(modelName)) {
        next.delete(modelName);
      } else {
        next.add(modelName);
      }
      return next;
    });
  };

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300">
      <div className="p-4 border-b border-border bg-gray-50/50">
        <h3 className="text-xl font-semibold text-text-primary">Model Comparison</h3>
        <p className="text-sm text-text-secondary">Predicted {variable}</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-secondary uppercase bg-gray-50/50">
            <tr>
              <th className="px-4 py-3 font-medium">Model</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium text-right">Value</th>
              <th className="px-4 py-3 font-medium text-right">Difference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {otherModels.map((model) => {
              const diff = blendModel ? (model.value - blendModel.value) : 0;
              const diffStr = diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
              const isHidden = hiddenModels.has(model.model);
              
              return (
                <tr key={model.model} className={clsx("hover:bg-gray-50/50 transition-colors group", isHidden && "opacity-50")}>
                  <td className="px-4 py-3 font-medium text-text-primary flex items-center gap-2">
                    <button 
                      onClick={() => toggleVisibility(model.model)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                      aria-label={isHidden ? `Show ${model.model}` : `Hide ${model.model}`}
                    >
                      {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <div>
                      {model.model}
                      {model.initializationTime && (
                        <span className="block text-[10px] text-text-secondary font-normal mt-0.5">
                          Init: {new Date(model.initializationTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx(
                      "text-[10px] px-2 py-0.5 rounded-full font-medium tracking-wide",
                      model.isAi ? "bg-purple-100 text-purple-700" : 
                      model.isEnsemble ? "bg-blue-100 text-blue-700" : 
                      "bg-gray-100 text-gray-700"
                    )}>
                      {model.isAi ? "AI" : model.isEnsemble ? "ENSEMBLE" : "NWP"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {model.value.toFixed(1)} <span className="text-text-secondary text-xs">{model.unit}</span>
                  </td>
                  <td className={clsx(
                    "px-4 py-3 text-right tabular-nums",
                    diff > 0 ? "text-status-danger" : diff < 0 ? "text-status-success" : "text-text-secondary"
                  )}>
                    {diff === 0 ? "-" : diffStr}
                  </td>
                </tr>
              );
            })}
            
            {missingSources.map(source => (
              <tr key={`missing-${source}`} className="bg-red-50/30">
                <td className="px-4 py-3 font-medium text-text-primary">
                  {source}
                  <span className="block text-[10px] text-status-danger font-normal mt-0.5">
                    Currently unavailable
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium tracking-wide bg-red-100 text-status-danger">
                    OFFLINE
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-text-secondary">-</td>
                <td className="px-4 py-3 text-right text-text-secondary">-</td>
              </tr>
            ))}
          </tbody>
          {blendModel && (
            <tfoot className="bg-primary-light/50 font-medium">
              <tr>
                <td className="px-4 py-4 text-primary">Bharat Blend</td>
                <td className="px-4 py-4">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-white tracking-wide">
                    BLENDED
                  </span>
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-text-primary">
                  {blendModel.value.toFixed(1)} <span className="text-text-secondary text-xs">{blendModel.unit}</span>
                </td>
                <td className="px-4 py-4 text-right text-text-secondary">-</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

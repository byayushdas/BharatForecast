with open('d:/BharatForecast/backend/app/services/forecast_service.py', 'r') as f:
    text = f.read()

text = text.replace("        ]\n        \n        blend_val = sum(weights.get(m.model, 0.0) * m.value for m in models)\n        models.append(ModelForecastSchema(model=\"BLEND\", value=float(f\"{blend_val:.1f}\"), unit=var_unit, isEnsemble=False, isAi=False))\n        ])", "        ])\n        \n        blend_val = sum(weights.get(m.model, 0.0) * m.value for m in models)\n        models.append(ModelForecastSchema(model=\"BLEND\", value=float(f\"{blend_val:.1f}\"), unit=var_unit, isEnsemble=False, isAi=False))")

with open('d:/BharatForecast/backend/app/services/forecast_service.py', 'w') as f:
    f.write(text)

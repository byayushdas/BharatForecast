import type { WeatherVariable } from '../types/weather';
export const units: Record<WeatherVariable, string> = { Rainfall: 'mm', Temperature: '°C', Wind: 'm/s' };
export const dataKeys = { Rainfall: 'rainfall', Temperature: 'temperature', Wind: 'windSpeed' } as const;
export const modelColors: Record<string, string> = { GFS: '#5989eb', GEFS: '#82babc', IFS: '#9c8be0', AIFS: '#315cde' };
export const formatIST = (value: string, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) => new Date(value).toLocaleString('en-IN', { ...options, timeZone: 'Asia/Kolkata' });
export const number = (value: number | undefined) => value === undefined || !Number.isFinite(value) ? '—' : value.toLocaleString('en-IN', { maximumFractionDigits: 1 });

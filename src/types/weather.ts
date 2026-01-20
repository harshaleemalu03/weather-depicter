// Weather data types

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'night';

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  condition: WeatherCondition;
  description: string;
  feelsLike: number;
  windSpeed: number;
}

export interface AQIData {
  value: number;
  level: 'good' | 'moderate' | 'poor';
  label: string;
}

export interface WeatherResponse {
  weather: WeatherData;
  aqi: AQIData;
}

export interface GeolocationPosition {
  lat: number;
  lon: number;
}

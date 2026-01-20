// Weather API service
// Uses OpenWeatherMap API - requires API key for production

import { WeatherData, AQIData, WeatherResponse, WeatherCondition, GeolocationPosition } from '@/types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Determines weather condition from OpenWeatherMap weather code
 */
function getWeatherCondition(weatherId: number, isNight: boolean): WeatherCondition {
  if (isNight && weatherId < 800) return 'night';
  
  if (weatherId >= 200 && weatherId < 300) return 'stormy'; // Thunderstorm
  if (weatherId >= 300 && weatherId < 600) return 'rainy';  // Drizzle & Rain
  if (weatherId >= 600 && weatherId < 700) return 'cloudy'; // Snow (treated as cloudy)
  if (weatherId >= 700 && weatherId < 800) return 'cloudy'; // Atmosphere (fog, mist)
  if (weatherId === 800) return isNight ? 'night' : 'sunny'; // Clear
  if (weatherId > 800) return 'cloudy'; // Clouds
  
  return 'sunny';
}

/**
 * Determines AQI level from value
 */
function getAQILevel(aqi: number): { level: 'good' | 'moderate' | 'poor'; label: string } {
  if (aqi <= 50) return { level: 'good', label: 'Good' };
  if (aqi <= 100) return { level: 'moderate', label: 'Moderate' };
  return { level: 'poor', label: 'Poor' };
}

/**
 * Fetches weather data for a city
 */
export async function fetchWeatherByCity(city: string): Promise<WeatherResponse> {
  if (!API_KEY) {
    // Return mock data if no API key is configured
    return getMockWeatherData(city);
  }

  try {
    // Fetch current weather
    const weatherRes = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    if (!weatherRes.ok) {
      if (weatherRes.status === 404) {
        throw new Error('City not found. Please check the spelling and try again.');
      }
      throw new Error('Unable to fetch weather data. Please try again later.');
    }

    const weatherData = await weatherRes.json();

    // Fetch AQI data
    const { lat, lon } = weatherData.coord;
    const aqiRes = await fetch(
      `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    let aqiValue = 50; // Default moderate AQI
    if (aqiRes.ok) {
      const aqiData = await aqiRes.json();
      // OpenWeatherMap returns AQI 1-5, we convert to 0-500 scale
      const aqiIndex = aqiData.list[0]?.main?.aqi || 2;
      aqiValue = aqiIndex === 1 ? 25 : aqiIndex === 2 ? 50 : aqiIndex === 3 ? 100 : aqiIndex === 4 ? 150 : 200;
    }

    // Check if it's night
    const now = Date.now() / 1000;
    const isNight = now < weatherData.sys.sunrise || now > weatherData.sys.sunset;

    const weather: WeatherData = {
      city: weatherData.name,
      country: weatherData.sys.country,
      temperature: Math.round(weatherData.main.temp),
      humidity: weatherData.main.humidity,
      condition: getWeatherCondition(weatherData.weather[0].id, isNight),
      description: weatherData.weather[0].description,
      feelsLike: Math.round(weatherData.main.feels_like),
      windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
    };

    const aqiInfo = getAQILevel(aqiValue);
    const aqi: AQIData = {
      value: aqiValue,
      level: aqiInfo.level,
      label: aqiInfo.label,
    };

    return { weather, aqi };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
}

/**
 * Fetches weather data by coordinates
 */
export async function fetchWeatherByCoords(position: GeolocationPosition): Promise<WeatherResponse> {
  if (!API_KEY) {
    return getMockWeatherData('Your Location');
  }

  try {
    const weatherRes = await fetch(
      `${BASE_URL}/weather?lat=${position.lat}&lon=${position.lon}&appid=${API_KEY}&units=metric`
    );

    if (!weatherRes.ok) {
      throw new Error('Unable to fetch weather for your location.');
    }

    const weatherData = await weatherRes.json();
    return fetchWeatherByCity(weatherData.name);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
}

/**
 * Returns mock weather data for demo purposes
 */
function getMockWeatherData(city: string): WeatherResponse {
  // Simulate different weather based on city name hash
  const hash = city.toLowerCase().split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const conditions: WeatherCondition[] = ['sunny', 'cloudy', 'rainy', 'stormy'];
  const condition = conditions[hash % 4];

  const mockWeather: WeatherData = {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    country: 'Demo',
    temperature: 15 + (hash % 20),
    humidity: 40 + (hash % 40),
    condition,
    description: condition === 'sunny' ? 'Clear sky' : 
                 condition === 'cloudy' ? 'Partly cloudy' :
                 condition === 'rainy' ? 'Light rain' : 'Thunderstorm',
    feelsLike: 13 + (hash % 20),
    windSpeed: 5 + (hash % 25),
  };

  const aqiValue = 20 + (hash % 150);
  const aqiInfo = getAQILevel(aqiValue);

  return {
    weather: mockWeather,
    aqi: {
      value: aqiValue,
      level: aqiInfo.level,
      label: aqiInfo.label,
    },
  };
}

/**
 * Gets health tip based on AQI level
 */
export function getHealthTip(level: 'good' | 'moderate' | 'poor'): string {
  switch (level) {
    case 'good':
      return 'Air quality is excellent. Perfect for outdoor activities!';
    case 'moderate':
      return 'Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exposure.';
    case 'poor':
      return 'Air quality is poor. Consider wearing a mask outdoors and limit physical activities.';
  }
}

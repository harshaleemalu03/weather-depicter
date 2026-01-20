import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WeatherResponse, WeatherCondition } from '@/types/weather';
import { fetchWeatherByCity, fetchWeatherByCoords } from '@/lib/weather-api';
import { WeatherBackground } from './WeatherBackground';
import { SearchBar } from './SearchBar';
import { WeatherCard } from './WeatherCard';
import { AQICard } from './AQICard';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { WelcomeState } from './WelcomeState';

type AppState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Main Weather App component
 */
export function WeatherApp() {
  const [state, setState] = useState<AppState>('idle');
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [lastQuery, setLastQuery] = useState<string>('');
  const [isLocating, setIsLocating] = useState(false);

  // Current weather condition for background
  const currentCondition: WeatherCondition = weatherData?.weather.condition || 'sunny';

  /**
   * Search for weather by city name
   */
  const handleSearch = useCallback(async (city: string) => {
    setState('loading');
    setError('');
    setLastQuery(city);

    try {
      const data = await fetchWeatherByCity(city);
      setWeatherData(data);
      setState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setState('error');
    }
  }, []);

  /**
   * Get weather for user's current location
   */
  const handleUseLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setState('error');
      return;
    }

    setIsLocating(true);
    setState('loading');
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await fetchWeatherByCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setWeatherData(data);
          setState('success');
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
          setState('error');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        setError(`Location error: ${err.message}`);
        setState('error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  /**
   * Retry last search
   */
  const handleRetry = useCallback(() => {
    if (lastQuery) {
      handleSearch(lastQuery);
    } else {
      setState('idle');
    }
  }, [lastQuery, handleSearch]);

  return (
    <WeatherBackground condition={currentCondition}>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.header
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-shadow-lg mb-2">
            Weather
          </h1>
          <p className="text-muted-foreground text-shadow">
            Real-time weather & air quality
          </p>
        </motion.header>

        {/* Search Bar */}
        <div className="w-full max-w-lg mb-8">
          <SearchBar
            onSearch={handleSearch}
            onUseLocation={handleUseLocation}
            isLoading={state === 'loading'}
            isLocating={isLocating}
          />
        </div>

        {/* Content Area */}
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {state === 'idle' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <WelcomeState />
              </motion.div>
            )}

            {state === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingState />
              </motion.div>
            )}

            {state === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ErrorState message={error} onRetry={handleRetry} />
              </motion.div>
            )}

            {state === 'success' && weatherData && (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <WeatherCard weather={weatherData.weather} />
                <AQICard aqi={weatherData.aqi} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer - API notice */}
        <motion.footer
          className="mt-12 text-center text-sm text-muted-foreground/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>Demo mode • Add OpenWeatherMap API key for live data</p>
        </motion.footer>
      </div>
    </WeatherBackground>
  );
}

export default WeatherApp;

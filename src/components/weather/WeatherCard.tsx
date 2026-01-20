import { motion } from 'framer-motion';
import { Thermometer, Droplets, Wind, MapPin } from 'lucide-react';
import { WeatherData } from '@/types/weather';

interface WeatherCardProps {
  weather: WeatherData;
}

/**
 * Main weather display card with temperature and conditions
 */
export function WeatherCard({ weather }: WeatherCardProps) {
  const weatherEmoji = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    stormy: '⛈️',
    night: '🌙',
  }[weather.condition];

  return (
    <motion.div
      className="glass-card p-8 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Location */}
      <motion.div 
        className="flex items-center justify-center gap-2 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <MapPin className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-lg font-medium text-foreground">
          {weather.city}, {weather.country}
        </h2>
      </motion.div>

      {/* Weather Icon & Temperature */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
      >
        <span className="text-7xl mb-2 block animate-float">{weatherEmoji}</span>
        <div className="flex items-start justify-center">
          <span className="text-8xl font-light tracking-tight text-foreground">
            {weather.temperature}
          </span>
          <span className="text-3xl font-light text-muted-foreground mt-4">°C</span>
        </div>
        <p className="text-muted-foreground capitalize mt-2 text-lg">
          {weather.description}
        </p>
      </motion.div>

      {/* Weather Details */}
      <motion.div 
        className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {/* Feels Like */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
            <Thermometer className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wide">Feels</span>
          </div>
          <p className="text-xl font-semibold text-foreground">{weather.feelsLike}°</p>
        </div>

        {/* Humidity */}
        <div className="text-center border-x border-border/50">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
            <Droplets className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wide">Humidity</span>
          </div>
          <p className="text-xl font-semibold text-foreground">{weather.humidity}%</p>
        </div>

        {/* Wind */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
            <Wind className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wide">Wind</span>
          </div>
          <p className="text-xl font-semibold text-foreground">{weather.windSpeed} km/h</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default WeatherCard;

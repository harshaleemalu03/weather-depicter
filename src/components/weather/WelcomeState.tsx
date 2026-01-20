import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, MapPin } from 'lucide-react';

/**
 * Welcome screen shown before first search
 */
export function WelcomeState() {
  return (
    <motion.div
      className="glass-card p-10 text-center max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated icons */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
        >
          <Sun className="w-10 h-10 text-weather-sun" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        >
          <Cloud className="w-12 h-12 text-weather-cloud" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
        >
          <CloudRain className="w-10 h-10 text-weather-rain" />
        </motion.div>
      </div>

      {/* Welcome text */}
      <h2 className="text-2xl font-semibold text-foreground mb-3">
        Check the Weather
      </h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        Search for any city to get current temperature, humidity, and air quality information.
      </p>

      {/* Suggestion */}
      <motion.div
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <MapPin className="w-4 h-4" />
        <span>Or use your current location</span>
      </motion.div>
    </motion.div>
  );
}

export default WelcomeState;

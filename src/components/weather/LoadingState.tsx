import { motion } from 'framer-motion';
import { Cloud, Sun } from 'lucide-react';

/**
 * Beautiful loading animation while fetching weather data
 */
export function LoadingState() {
  return (
    <motion.div
      className="glass-card p-12 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated weather icons */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        {/* Sun */}
        <motion.div
          className="absolute top-0 right-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        >
          <Sun className="w-12 h-12 text-weather-sun" />
        </motion.div>

        {/* Cloud */}
        <motion.div
          className="absolute bottom-4 left-0"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Cloud className="w-16 h-16 text-weather-cloud" />
        </motion.div>

        {/* Loading dots */}
        <div className="absolute bottom-0 right-0 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-primary"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading text */}
      <motion.p
        className="text-muted-foreground font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Fetching weather data...
      </motion.p>
    </motion.div>
  );
}

export default LoadingState;

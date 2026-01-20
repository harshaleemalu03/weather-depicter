import { motion } from 'framer-motion';
import { WeatherCondition } from '@/types/weather';

interface WeatherBackgroundProps {
  condition: WeatherCondition;
  children: React.ReactNode;
}

/**
 * Dynamic background that changes based on weather conditions
 */
export function WeatherBackground({ condition, children }: WeatherBackgroundProps) {
  // Map conditions to background classes
  const bgClass = {
    sunny: 'weather-bg-sunny',
    cloudy: 'weather-bg-cloudy',
    rainy: 'weather-bg-rainy',
    stormy: 'weather-bg-stormy',
    night: 'weather-bg-night',
  }[condition];

  return (
    <motion.div
      className={`min-h-screen w-full transition-all duration-1000 ${bgClass}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={condition}
    >
      {/* Animated weather particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {condition === 'rainy' && <RainParticles />}
        {condition === 'sunny' && <SunRays />}
        {condition === 'cloudy' && <CloudDrift />}
        {condition === 'stormy' && <StormFlashes />}
        {condition === 'night' && <Stars />}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

// Rain animation particles
function RainParticles() {
  return (
    <>
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-4 bg-white/30 rounded-full"
          initial={{ 
            x: `${Math.random() * 100}vw`, 
            y: -20,
            opacity: 0.3 + Math.random() * 0.4
          }}
          animate={{ 
            y: '110vh',
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.5,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'linear',
          }}
        />
      ))}
    </>
  );
}

// Sun rays animation
function SunRays() {
  return (
    <motion.div
      className="absolute top-0 right-0 w-96 h-96 -mt-20 -mr-20"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="w-full h-full rounded-full bg-gradient-to-br from-accent/40 to-accent/20 blur-3xl animate-pulse-soft" />
    </motion.div>
  );
}

// Cloud drift animation
function CloudDrift() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-secondary/30"
          style={{
            width: 100 + Math.random() * 200,
            height: 40 + Math.random() * 60,
            top: `${10 + Math.random() * 40}%`,
            filter: 'blur(20px)',
          }}
          initial={{ x: '-20vw' }}
          animate={{ x: '120vw' }}
          transition={{
            duration: 30 + Math.random() * 20,
            repeat: Infinity,
            delay: i * 5,
            ease: 'linear',
          }}
        />
      ))}
    </>
  );
}

// Storm flash animation
function StormFlashes() {
  return (
    <>
      <RainParticles />
      <motion.div
        className="absolute inset-0 bg-white/5"
        animate={{
          opacity: [0, 0, 0.3, 0, 0, 0, 0.2, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          times: [0, 0.3, 0.31, 0.32, 0.7, 0.71, 0.72, 1],
        }}
      />
    </>
  );
}

// Night stars animation
function Stars() {
  return (
    <>
      {Array.from({ length: 100 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary-foreground rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </>
  );
}

export default WeatherBackground;

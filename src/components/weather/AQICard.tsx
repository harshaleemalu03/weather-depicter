import { motion } from 'framer-motion';
import { Wind, AlertTriangle, Leaf, ShieldAlert } from 'lucide-react';
import { AQIData } from '@/types/weather';
import { getHealthTip } from '@/lib/weather-api';

interface AQICardProps {
  aqi: AQIData;
}

/**
 * Air Quality Index display with color coding and health tips
 */
export function AQICard({ aqi }: AQICardProps) {
  const healthTip = getHealthTip(aqi.level);

  const levelStyles = {
    good: {
      bgClass: 'aqi-good',
      icon: Leaf,
      iconBg: 'bg-emerald-500/20',
    },
    moderate: {
      bgClass: 'aqi-moderate',
      icon: AlertTriangle,
      iconBg: 'bg-amber-500/20',
    },
    poor: {
      bgClass: 'aqi-poor',
      icon: ShieldAlert,
      iconBg: 'bg-red-500/20',
    },
  }[aqi.level];

  const Icon = levelStyles.icon;

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-start gap-4">
        {/* AQI Badge */}
        <motion.div
          className={`${levelStyles.bgClass} rounded-2xl p-4 min-w-[80px] text-center`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
        >
          <div className="text-3xl font-bold">{aqi.value}</div>
          <div className="text-xs font-medium uppercase tracking-wide opacity-90">AQI</div>
        </motion.div>

        {/* AQI Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">Air Quality</h3>
          </div>
          
          <motion.div
            className="flex items-center gap-2 mb-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className={`w-3 h-3 rounded-full ${
              aqi.level === 'good' ? 'bg-aqi-good' :
              aqi.level === 'moderate' ? 'bg-aqi-moderate' : 'bg-aqi-poor'
            }`} />
            <span className="font-medium text-foreground">{aqi.label}</span>
          </motion.div>

          {/* Health Tip */}
          <motion.div
            className="flex items-start gap-2 p-3 rounded-xl bg-secondary/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className={`p-1.5 rounded-lg ${levelStyles.iconBg}`}>
              <Icon className={`w-4 h-4 ${
                aqi.level === 'good' ? 'text-emerald-600' :
                aqi.level === 'moderate' ? 'text-amber-600' : 'text-red-600'
              }`} />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {healthTip}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default AQICard;

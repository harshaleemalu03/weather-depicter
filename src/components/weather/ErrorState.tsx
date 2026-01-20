import { motion } from 'framer-motion';
import { CloudOff, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

/**
 * Error display with retry option
 */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      className="glass-card p-8 text-center max-w-md mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      {/* Error icon */}
      <motion.div
        className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-destructive/10 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <CloudOff className="w-8 h-8 text-destructive" />
      </motion.div>

      {/* Error message */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-muted-foreground mb-6">{message}</p>

      {/* Retry button */}
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
}

export default ErrorState;

import { motion } from 'framer-motion';

interface CrossLoaderProps {
  size?: number;
  color?: string;
  duration?: number;
}

export const CrossLoader = ({ 
  size = 60, 
  color = '#d97706', 
  duration = 2 
}: CrossLoaderProps) => {
  const strokeWidth = size * 0.08;
  const center = size / 2;
  const armLength = size * 0.35;
  const crossTop = size * 0.25;

  return (
    <div className="flex items-center justify-center">
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        animate={{ rotate: 360 }}
        transition={{ duration, ease: "easeInOut" }}
      >
        {/* Glow effect */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Vertical line - starts as plus, becomes cross */}
        <motion.line
          x1={center}
          y1={center - armLength}
          x2={center}
          y2={center + armLength}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ 
            pathLength: 1,
            y1: crossTop,
            y2: center + armLength
          }}
          transition={{ 
            pathLength: { duration: duration * 0.4 },
            y1: { duration: duration * 0.6, delay: duration * 0.4 },
            y2: { duration: duration * 0.6, delay: duration * 0.4 }
          }}
        />

        {/* Horizontal line */}
        <motion.line
          x1={center - armLength}
          y1={center}
          x2={center + armLength}
          y2={center}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ 
            pathLength: 1,
            y1: center * 0.8,
            y2: center * 0.8
          }}
          transition={{ 
            pathLength: { duration: duration * 0.4, delay: duration * 0.2 },
            y1: { duration: duration * 0.6, delay: duration * 0.4 },
            y2: { duration: duration * 0.6, delay: duration * 0.4 }
          }}
        />

        {/* Pulsing glow overlay */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.7, 1] }}
          transition={{ 
            delay: duration,
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          filter="url(#glow)"
        >
          <line
            x1={center}
            y1={crossTop}
            x2={center}
            y2={center + armLength}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity={0.6}
          />
          <line
            x1={center - armLength}
            y1={center * 0.8}
            x2={center + armLength}
            y2={center * 0.8}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity={0.6}
          />
        </motion.g>
      </motion.svg>
    </div>
  );
};
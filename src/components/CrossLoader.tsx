import { motion } from 'framer-motion';

interface CrossLoaderProps {
  variant?: 'morphing' | 'particle' | 'neon';
  size?: number;
  color?: string;
  duration?: number;
}

export const CrossLoader = ({ 
  variant = 'morphing', 
  size = 32, 
  color = '#d97706',
  duration = 2 
}: CrossLoaderProps) => {
  
  if (variant === 'morphing') {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <motion.div
          className="relative"
          animate={{
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div
            style={{
              width: size * 0.6,
              height: 3,
              backgroundColor: color,
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: 2
            }}
            animate={{
              height: [3, size * 0.8, 3],
              width: [size * 0.6, 3, size * 0.6]
            }}
            transition={{
              duration: duration / 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div
            style={{
              width: 3,
              height: size * 0.8,
              backgroundColor: color,
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: 2
            }}
            animate={{
              width: [3, size * 0.6, 3],
              height: [size * 0.8, 3, size * 0.8]
            }}
            transition={{
              duration: duration / 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </motion.div>
      </div>
    );
  }

  if (variant === 'particle') {
    const particles = [
      { x: 0, y: -size * 0.3 },
      { x: 0, y: -size * 0.15 },
      { x: 0, y: 0 },
      { x: 0, y: size * 0.15 },
      { x: 0, y: size * 0.3 },
      { x: -size * 0.2, y: 0 },
      { x: size * 0.2, y: 0 }
    ];

    return (
      <div className="relative" style={{ width: size, height: size }}>
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            style={{
              width: 4,
              height: 4,
              backgroundColor: color,
              borderRadius: '50%',
              position: 'absolute',
              left: '50%',
              top: '50%'
            }}
            animate={{
              x: [Math.random() * size - size/2, particle.x],
              y: [Math.random() * size - size/2, particle.y],
              opacity: [0, 1, 0.7, 1]
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'neon') {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <motion.div
          className="relative"
          animate={{
            filter: [
              `drop-shadow(0 0 5px ${color}) drop-shadow(0 0 10px ${color})`,
              `drop-shadow(0 0 10px ${color}) drop-shadow(0 0 20px ${color})`,
              `drop-shadow(0 0 5px ${color}) drop-shadow(0 0 10px ${color})`
            ]
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div
            style={{
              width: size * 0.6,
              height: 3,
              backgroundColor: color,
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: 2
            }}
          />
          <div
            style={{
              width: 3,
              height: size * 0.8,
              backgroundColor: color,
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: 2
            }}
          />
          <motion.div
            style={{
              width: size,
              height: size,
              border: `1px solid ${color}20`,
              borderRadius: '50%',
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{
              duration: duration * 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    );
  }

  return null;
};
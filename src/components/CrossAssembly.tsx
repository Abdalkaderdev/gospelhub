import { motion } from 'framer-motion';

interface CrossAssemblyProps {
  size?: number;
  color?: string;
  thickness?: number;
}

export const CrossAssembly = ({ 
  size = 60, 
  color = '#d97706', 
  thickness = 8 
}: CrossAssemblyProps) => {
  const armLength = size * 0.35;
  const crossbarLength = size * 0.3;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const pieceVariants = {
    hidden: (direction: string) => ({
      opacity: 0,
      x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
      y: direction === 'top' ? -50 : direction === 'bottom' ? 50 : 0
    }),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top piece */}
        <motion.div
          className="absolute"
          style={{
            width: thickness,
            height: armLength,
            backgroundColor: color,
            left: '50%',
            top: 0,
            transform: 'translateX(-50%)',
            borderRadius: thickness / 2
          }}
          variants={pieceVariants}
          custom="top"
        />

        {/* Bottom piece */}
        <motion.div
          className="absolute"
          style={{
            width: thickness,
            height: armLength,
            backgroundColor: color,
            left: '50%',
            bottom: 0,
            transform: 'translateX(-50%)',
            borderRadius: thickness / 2
          }}
          variants={pieceVariants}
          custom="bottom"
        />

        {/* Left piece */}
        <motion.div
          className="absolute"
          style={{
            width: crossbarLength,
            height: thickness,
            backgroundColor: color,
            left: 0,
            top: '40%',
            transform: 'translateY(-50%)',
            borderRadius: thickness / 2
          }}
          variants={pieceVariants}
          custom="left"
        />

        {/* Right piece */}
        <motion.div
          className="absolute"
          style={{
            width: crossbarLength,
            height: thickness,
            backgroundColor: color,
            right: 0,
            top: '40%',
            transform: 'translateY(-50%)',
            borderRadius: thickness / 2
          }}
          variants={pieceVariants}
          custom="right"
        />

        {/* Pulse overlay when complete */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
            borderRadius: '50%'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          variants={pulseVariants}
          animate="pulse"
        />
      </motion.div>
    </div>
  );
};
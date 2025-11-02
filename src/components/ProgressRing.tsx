import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#d97706',
  backgroundColor = '#e7e5e4',
  label,
  showPercentage = true,
  animated = true
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg
      .append('g')
      .attr('transform', `translate(${size / 2}, ${size / 2})`);

    // Background circle
    g.append('circle')
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', backgroundColor)
      .attr('stroke-width', strokeWidth);

    // Progress circle
    const progressCircle = g
      .append('circle')
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', strokeWidth)
      .attr('stroke-linecap', 'round')
      .attr('stroke-dasharray', circumference)
      .attr('stroke-dashoffset', circumference)
      .attr('transform', 'rotate(-90)');

    if (animated) {
      progressCircle
        .transition()
        .duration(1000)
        .ease(d3.easeCircleOut)
        .attr('stroke-dashoffset', circumference - (progress / 100) * circumference);
    } else {
      progressCircle
        .attr('stroke-dashoffset', circumference - (progress / 100) * circumference);
    }

    // Center text
    if (showPercentage || label) {
      const textGroup = g.append('g').attr('text-anchor', 'middle');
      
      if (showPercentage) {
        textGroup
          .append('text')
          .attr('dy', label ? '-0.2em' : '0.35em')
          .attr('font-size', size * 0.15)
          .attr('font-weight', 'bold')
          .attr('fill', color)
          .text(`${Math.round(progress)}%`);
      }
      
      if (label) {
        textGroup
          .append('text')
          .attr('dy', showPercentage ? '1.2em' : '0.35em')
          .attr('font-size', size * 0.08)
          .attr('fill', '#78716c')
          .text(label);
      }
    }
  }, [progress, size, strokeWidth, color, backgroundColor, label, showPercentage, animated, radius, circumference]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex items-center justify-center"
    >
      <svg
        ref={svgRef}
        width={size}
        height={size}
        className="drop-shadow-sm"
      />
    </motion.div>
  );
};
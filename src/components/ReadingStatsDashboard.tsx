import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressRing } from './ProgressRing';
import { ReadingStats } from '../readingPlan';
import { Calendar, TrendingUp, BookOpen, Target } from 'lucide-react';

interface ReadingStatsDashboardProps {
  stats: ReadingStats;
  className?: string;
}

interface ChartData {
  date: string;
  value: number;
}

export const ReadingStatsDashboard: React.FC<ReadingStatsDashboardProps> = ({
  stats,
  className = ''
}) => {
  const chartRef = useRef<SVGSVGElement>(null);
  const [selectedMetric, setSelectedMetric] = useState<'streak' | 'chapters' | 'verses'>('streak');

  // Generate sample data for the chart
  const generateChartData = (): ChartData[] => {
    const data: ChartData[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      let value = 0;
      switch (selectedMetric) {
        case 'streak':
          value = Math.max(0, stats.currentStreak - i);
          break;
        case 'chapters':
          value = Math.floor(Math.random() * 5) + 1;
          break;
        case 'verses':
          value = Math.floor(Math.random() * 50) + 10;
          break;
      }
      
      data.push({
        date: date.toISOString().split('T')[0],
        value
      });
    }
    
    return data;
  };

  const chartData = generateChartData();

  useEffect(() => {
    if (!chartRef.current || chartData.length === 0) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(chartData, d => new Date(d.date)) as [Date, Date])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.value) || 0])
      .nice()
      .range([height, 0]);

    // Line generator
    const line = d3.line<ChartData>()
      .x(d => xScale(new Date(d.date)))
      .y(d => yScale(d.value))
      .curve(d3.curveCardinal);

    // Area generator
    const area = d3.area<ChartData>()
      .x(d => xScale(new Date(d.date)))
      .y0(height)
      .y1(d => yScale(d.value))
      .curve(d3.curveCardinal);

    // Add gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'area-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', height)
      .attr('x2', 0).attr('y2', 0);

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#d97706')
      .attr('stop-opacity', 0.1);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#d97706')
      .attr('stop-opacity', 0.6);

    // Add area
    g.append('path')
      .datum(chartData)
      .attr('fill', 'url(#area-gradient)')
      .attr('d', area);

    // Add line
    const path = g.append('path')
      .datum(chartData)
      .attr('fill', 'none')
      .attr('stroke', '#d97706')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Animate line drawing
    const totalLength = path.node()?.getTotalLength() || 0;
    path
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

    // Add dots
    g.selectAll('.dot')
      .data(chartData)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(new Date(d.date)))
      .attr('cy', d => yScale(d.value))
      .attr('r', 0)
      .attr('fill', '#d97706')
      .transition()
      .delay((d, i) => i * 50)
      .duration(300)
      .attr('r', 3);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%m/%d')))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#78716c');

    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#78716c');

  }, [chartData, selectedMetric]);

  const completionPercentage = stats.totalDays > 0 
    ? Math.round((stats.completedDays / stats.totalDays) * 100) 
    : 0;

  const metrics = [
    {
      key: 'streak' as const,
      label: 'Current Streak',
      value: stats.currentStreak,
      icon: TrendingUp,
      color: '#d97706'
    },
    {
      key: 'chapters' as const,
      label: 'Chapters Read',
      value: stats.chaptersRead,
      icon: BookOpen,
      color: '#059669'
    },
    {
      key: 'verses' as const,
      label: 'Verses Read',
      value: stats.versesRead,
      icon: Target,
      color: '#dc2626'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg ${className}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-amber-600" />
        <h2 className="text-xl font-semibold text-stone-800">Reading Statistics</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Ring */}
        <div className="flex flex-col items-center">
          <ProgressRing
            progress={completionPercentage}
            size={160}
            strokeWidth={12}
            color="#d97706"
            label="Plan Progress"
          />
          <div className="mt-4 text-center">
            <p className="text-sm text-stone-600">
              {stats.completedDays} of {stats.totalDays} days completed
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Longest streak: {stats.longestStreak} days
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="flex flex-col">
          <div className="flex gap-2 mb-4">
            {metrics.map((metric) => (
              <button
                key={metric.key}
                onClick={() => setSelectedMetric(metric.key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedMetric === metric.key
                    ? 'bg-amber-100 text-amber-800 shadow-sm'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <metric.icon className="w-4 h-4 inline mr-1" />
                {metric.label}
              </button>
            ))}
          </div>
          
          <svg
            ref={chartRef}
            width={400}
            height={200}
            className="border border-stone-200 rounded-lg bg-white/50"
          />
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <AnimatePresence mode="wait">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="bg-white/60 rounded-xl p-4 text-center border border-stone-200"
            >
              <metric.icon 
                className="w-8 h-8 mx-auto mb-2" 
                style={{ color: metric.color }}
              />
              <p className="text-2xl font-bold text-stone-800">{metric.value}</p>
              <p className="text-sm text-stone-600">{metric.label}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Books Completed */}
      {stats.booksCompleted.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200"
        >
          <h3 className="font-semibold text-green-800 mb-2">Books Completed</h3>
          <div className="flex flex-wrap gap-2">
            {stats.booksCompleted.map((book, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
              >
                {book}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
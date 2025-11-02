import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface ReadingChartProps {
  data: { day: string; minutes: number }[];
  goal?: number;
}

export const ReadingChart = ({ data, goal = 30 }: ReadingChartProps) => {
  const maxValue = useMemo(() => Math.max(...data.map(d => d.minutes), goal), [data, goal]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-[var(--color-text)]">Weekly Reading</h3>
        <span className="text-sm text-[var(--color-text-secondary)]">Goal: {goal}min/day</span>
      </div>
      
      <div className="flex items-end justify-between h-32 gap-2">
        {data.map((item, index) => (
          <div key={item.day} className="flex flex-col items-center flex-1">
            <div className="relative w-full h-24 bg-[var(--color-border)] rounded-t">
              <motion.div
                className={`absolute bottom-0 w-full rounded-t transition-colors ${
                  item.minutes >= goal 
                    ? 'bg-[var(--color-primary)]' 
                    : 'bg-[var(--color-accent)]'
                }`}
                initial={{ height: 0 }}
                animate={{ height: `${(item.minutes / maxValue) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
              {goal && (
                <div 
                  className="absolute w-full border-t-2 border-dashed border-[var(--color-secondary)]"
                  style={{ bottom: `${(goal / maxValue) * 100}%` }}
                />
              )}
            </div>
            <span className="mt-2 text-xs text-[var(--color-text-secondary)]">{item.day}</span>
            <span className="text-xs font-medium text-[var(--color-text)]">{item.minutes}m</span>
          </div>
        ))}
      </div>
    </div>
  );
};
import { motion } from 'framer-motion';

interface ReadingHeatmapProps {
  data: { date: string; count: number }[];
}

export const ReadingHeatmap = ({ data }: ReadingHeatmapProps) => {
  const maxCount = Math.max(...data.map(d => d.count));
  
  const getIntensity = (count: number) => {
    if (count === 0) return 0;
    return Math.min(count / maxCount, 1);
  };

  const getColor = (intensity: number) => {
    if (intensity === 0) return 'var(--color-border)';
    const alpha = 0.2 + (intensity * 0.8);
    return `color-mix(in srgb, var(--color-primary) ${Math.round(alpha * 100)}%, transparent)`;
  };

  return (
    <div className="space-y-4" role="img" aria-label="Reading activity heatmap">
      <h3 className="text-lg font-medium text-[var(--color-text)]">Reading Activity</h3>
      
      <div className="grid grid-cols-53 gap-1 p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
        {data.map((day, index) => (
          <motion.div
            key={day.date}
            className="w-3 h-3 rounded-sm cursor-pointer"
            style={{ backgroundColor: getColor(getIntensity(day.count)) }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.001, duration: 0.2 }}
            title={`${day.date}: ${day.count} sessions`}
            aria-label={`${day.date}: ${day.count} reading sessions`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Could trigger a detail view
              }
            }}
          />
        ))}
      </div>
      
      <div className="flex items-center justify-between text-sm text-[var(--color-text-secondary)]">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 0.25, 0.5, 0.75, 1].map(intensity => (
            <div
              key={intensity}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getColor(intensity) }}
              aria-hidden="true"
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};
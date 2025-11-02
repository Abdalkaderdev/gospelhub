import { motion } from 'framer-motion';

interface ReadingVelocityProps {
  data: { period: string; versesPerMinute: number }[];
}

export const ReadingVelocity = ({ data }: ReadingVelocityProps) => {
  const maxVelocity = Math.max(...data.map(d => d.versesPerMinute));
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-[var(--color-text)]">Reading Velocity</h3>
      
      <div className="flex items-end justify-between h-32 gap-2 p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
        {data.map((item, index) => (
          <div key={item.period} className="flex flex-col items-center flex-1">
            <div className="relative w-full h-24 bg-[var(--color-border)] rounded-t">
              <motion.div
                className="absolute bottom-0 w-full rounded-t"
                style={{ backgroundColor: 'var(--color-accent)' }}
                initial={{ height: 0 }}
                animate={{ height: `${maxVelocity > 0 ? (item.versesPerMinute / maxVelocity) * 100 : 0}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                aria-label={`${item.period}: ${item.versesPerMinute.toFixed(1)} verses per minute`}
              />
            </div>
            <span className="mt-2 text-xs text-[var(--color-text-secondary)]">{item.period}</span>
            <span className="text-xs font-medium text-[var(--color-text)]">
              {item.versesPerMinute.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-[var(--color-text-secondary)] text-center">
        Average verses read per minute over the last 7 days
      </p>
    </div>
  );
};
import React from 'react';
import { motion } from 'motion/react';
import type { WaterfallItem } from '../data/mockData';

interface WaterfallChartProps {
  data: WaterfallItem[];
}

export const WaterfallChart: React.FC<WaterfallChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => Math.abs(d.value)));
  
  let runningTotal = 0;
  const chartData = data.map((item, idx) => {
    const start = runningTotal;
    const value = item.value;
    
    if (item.type !== 'total') {
      runningTotal += value;
    }
    
    return {
      ...item,
      start: item.type === 'total' ? 0 : start,
      displayValue: item.type === 'total' ? value : Math.abs(value),
      finalValue: item.type === 'total' ? value : runningTotal,
    };
  });

  return (
    <div className="space-y-4">
      {chartData.map((item, idx) => {
        const widthPercent = (item.displayValue / maxValue) * 100;
        const isPositive = item.type === 'positive' || item.type === 'total';
        const color = item.type === 'total' 
          ? '#2ED3A6' 
          : item.type === 'positive' 
            ? '#6B8AFF' 
            : '#E05A5A';

        return (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground">{item.label}</span>
              <span className="text-foreground-secondary font-mono">
                {item.type === 'negative' ? '-' : ''}{(Math.abs(item.value) * 100).toFixed(0)}%
              </span>
            </div>
            
            <div className="relative h-9 bg-surface rounded-lg overflow-hidden">
              <motion.div
                className="absolute top-0 h-full rounded-lg"
                style={{
                  backgroundColor: color,
                  opacity: item.type === 'total' ? 1 : 0.8,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${widthPercent}%` }}
                transition={{ 
                  duration: 0.6, 
                  delay: idx * 0.1,
                  ease: [0.4, 0, 0.2, 1]
                }}
              />
              
              {/* Value label inside bar */}
              <div className="absolute inset-0 flex items-center px-3">
                <motion.span 
                  className="text-xs font-mono text-background z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                >
                  {(item.value * 100).toFixed(0)}%
                </motion.span>
              </div>
            </div>

            {/* Connector line to next item */}
            {idx < chartData.length - 1 && item.type !== 'total' && (
              <div className="flex justify-end pr-3 pt-1">
                <div className="w-px h-3 bg-border"></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

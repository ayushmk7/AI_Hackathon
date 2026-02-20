import React from 'react';

interface ConceptLensSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  description?: string;
}

export const ConceptLensSlider: React.FC<ConceptLensSliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  description,
}) => {
  const fillPct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-foreground">{label}</label>
        <span className="text-sm text-primary font-mono">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          background: `linear-gradient(to right, #22c55e ${fillPct}%, #1a1a2e ${fillPct}%)`,
        }}
        className="w-full h-1.5 rounded-lg appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-primary
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:transition-all
          [&::-webkit-slider-thumb]:hover:scale-110
          [&::-webkit-slider-thumb]:shadow-lg
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-primary
          [&::-moz-range-thumb]:border-0
          [&::-moz-range-thumb]:cursor-pointer
          [&::-moz-range-thumb]:shadow-lg
          [&::-webkit-slider-runnable-track]:bg-transparent
          [&::-moz-range-track]:bg-transparent"
      />
      {description && (
        <p className="text-xs text-foreground-secondary">{description}</p>
      )}
    </div>
  );
};

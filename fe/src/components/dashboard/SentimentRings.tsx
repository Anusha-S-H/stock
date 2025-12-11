import { useEffect, useState } from 'react';

interface SentimentRingsProps {
  positive: number;
  neutral: number;
  negative: number;
}

const CircularProgress = ({ 
  value, 
  color, 
  label 
}: { 
  value: number; 
  color: string; 
  label: string;
}) => {
  const [progress, setProgress] = useState(0);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted/30"
          />
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${color})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{Math.round(progress)}%</span>
        </div>
      </div>
      <span className="mt-3 text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
};

const SentimentRings = ({ positive, neutral, negative }: SentimentRingsProps) => {
  return (
    <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <h3 className="text-lg font-semibold text-foreground mb-6">Sentiment Analysis</h3>
      <div className="flex justify-around items-center flex-wrap gap-6">
        <CircularProgress value={positive} color="hsl(142, 76%, 45%)" label="Positive" />
        <CircularProgress value={neutral} color="hsl(217, 91%, 60%)" label="Neutral" />
        <CircularProgress value={negative} color="hsl(0, 84%, 60%)" label="Negative" />
      </div>
    </div>
  );
};

export default SentimentRings;

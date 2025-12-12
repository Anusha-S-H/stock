import { useMemo } from 'react';
import { X } from 'lucide-react';
import StockChart from '@/components/dashboard/StockChart';

interface Props {
  open: boolean;
  onClose: () => void;
}

const futureData = [
  { date: 'Jan', price: 280 },
  { date: 'Feb', price: 284 },
  { date: 'Mar', price: 289 },
  { date: 'Apr', price: 295 },
  { date: 'May', price: 302 },
  { date: 'Jun', price: 310 },
];

const AIPredictionModal = ({ open, onClose }: Props) => {
  const chartData = useMemo(() => futureData, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl glass-card p-6 rounded-2xl animate-scale-in">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Predictions</h3>
            <p className="text-sm text-muted-foreground">AI-powered price forecasting using historical patterns.</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="glass-card p-4">
          <StockChart
            data={chartData}
            title="6-Month Forecast"
            color="hsl(270, 80%, 60%)"
            showPrediction
          />
        </div>
      </div>
    </div>
  );
};

export default AIPredictionModal;

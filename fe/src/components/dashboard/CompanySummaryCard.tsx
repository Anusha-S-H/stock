import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CompanySummaryProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
}

const CompanySummaryCard = ({ symbol, name, price, change, recommendation }: CompanySummaryProps) => {
  const recommendationStyles = {
    BUY: 'bg-success/20 text-success border-success/30',
    SELL: 'bg-destructive/20 text-destructive border-destructive/30',
    HOLD: 'bg-warning/20 text-warning border-warning/30',
  };

  const recommendationIcons = {
    BUY: <TrendingUp className="w-4 h-4" />,
    SELL: <TrendingDown className="w-4 h-4" />,
    HOLD: <Minus className="w-4 h-4" />,
  };

  const isPositive = change >= 0;

  return (
    <div className="glass-card-hover p-6 shimmer animate-fade-in-up">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold text-foreground">{symbol}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${recommendationStyles[recommendation]}`}>
              {recommendationIcons[recommendation]}
              {recommendation}
            </span>
          </div>
          <p className="text-muted-foreground">{name}</p>
        </div>
      </div>

      <div className="flex items-end gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Current Price</p>
          <p className="text-3xl font-bold text-foreground">${price.toFixed(2)}</p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${isPositive ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="font-semibold">{isPositive ? '+' : ''}{change.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
};

export default CompanySummaryCard;

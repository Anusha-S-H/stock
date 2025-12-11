import { Sparkles, TrendingUp, AlertTriangle, Clock } from 'lucide-react';

interface StockPick {
  symbol: string;
  recommendation: string;
  type: 'strong' | 'slight' | 'risk' | 'longterm';
}

const picks: StockPick[] = [
  { symbol: 'NVDA', recommendation: 'Strong Buy', type: 'strong' },
  { symbol: 'AAPL', recommendation: 'Slight Buy', type: 'slight' },
  { symbol: 'TSLA', recommendation: 'High Risk Buy', type: 'risk' },
  { symbol: 'AMZN', recommendation: 'Long-Term Buy', type: 'longterm' },
];

const typeStyles = {
  strong: {
    bg: 'bg-success/20',
    border: 'border-success/30',
    text: 'text-success',
    icon: TrendingUp,
  },
  slight: {
    bg: 'bg-neon-blue/20',
    border: 'border-neon-blue/30',
    text: 'text-neon-blue',
    icon: TrendingUp,
  },
  risk: {
    bg: 'bg-warning/20',
    border: 'border-warning/30',
    text: 'text-warning',
    icon: AlertTriangle,
  },
  longterm: {
    bg: 'bg-secondary/20',
    border: 'border-secondary/30',
    text: 'text-secondary',
    icon: Clock,
  },
};

const AIStockPicks = () => {
  return (
    <div className="glass-card p-6 animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">AI Stock Picks</h3>
      </div>

      <div className="space-y-3">
        {picks.map((pick, index) => {
          const style = typeStyles[pick.type];
          const Icon = style.icon;

          return (
            <div
              key={pick.symbol}
              className={`flex items-center justify-between p-3 rounded-xl border ${style.bg} ${style.border} transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${style.bg} flex items-center justify-center`}>
                  <span className={`font-bold ${style.text}`}>{pick.symbol[0]}</span>
                </div>
                <span className="font-semibold text-foreground">{pick.symbol}</span>
              </div>
              <div className={`flex items-center gap-2 ${style.text}`}>
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{pick.recommendation}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIStockPicks;

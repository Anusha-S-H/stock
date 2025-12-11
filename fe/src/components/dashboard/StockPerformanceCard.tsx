import { TrendingUp, TrendingDown } from 'lucide-react';

interface StockPerformanceProps {
  symbol: string;
  name: string;
  buyPrice: number;
  currentPrice: number;
  currency?: string;
  accentColor: string;
  glowColor: string;
}

const StockPerformanceCard = ({
  symbol,
  name,
  buyPrice,
  currentPrice,
  currency = '$',
  accentColor,
  glowColor,
}: StockPerformanceProps) => {
  const profitLoss = ((currentPrice - buyPrice) / buyPrice) * 100;
  const isProfit = profitLoss >= 0;

  return (
    <div 
      className="glass-card-hover p-6 relative overflow-hidden group"
      style={{
        background: `linear-gradient(135deg, hsl(222 47% 10% / 0.9) 0%, hsl(222 47% 8% / 0.95) 100%)`,
      }}
    >
      {/* Accent glow */}
      <div 
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"
        style={{ backgroundColor: glowColor }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
            style={{ 
              background: `linear-gradient(135deg, ${accentColor}, ${glowColor})`,
              boxShadow: `0 0 20px ${glowColor}40`,
            }}
          >
            {symbol[0]}
          </div>
          <div>
            <p className="font-bold text-foreground">{symbol}</p>
            <p className="text-sm text-muted-foreground">{name}</p>
          </div>
        </div>

        {/* Prices */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Buy Price</span>
            <span className="text-foreground">{currency}{buyPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current</span>
            <span className="text-foreground font-semibold">{currency}{currentPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Profit/Loss */}
        <div 
          className={`flex items-center justify-between p-3 rounded-xl ${
            isProfit ? 'bg-success/10' : 'bg-destructive/10'
          }`}
        >
          <div className="flex items-center gap-2">
            {isProfit ? (
              <TrendingUp className="w-5 h-5 text-success" />
            ) : (
              <TrendingDown className="w-5 h-5 text-destructive" />
            )}
            <span className={`font-bold text-lg ${isProfit ? 'text-success' : 'text-destructive'}`}
              style={{
                textShadow: isProfit 
                  ? '0 0 10px hsl(142, 76%, 45%, 0.5)' 
                  : '0 0 10px hsl(0, 84%, 60%, 0.5)',
              }}
            >
              {isProfit ? '+' : ''}{profitLoss.toFixed(0)}%
            </span>
          </div>
          <span className={`text-sm ${isProfit ? 'text-success' : 'text-destructive'}`}>
            {isProfit ? 'Profit' : 'Loss'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StockPerformanceCard;

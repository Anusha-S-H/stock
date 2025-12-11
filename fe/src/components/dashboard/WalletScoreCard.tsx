import { Wallet } from 'lucide-react';

interface WalletScoreCardProps {
  cash: number;
  holdingsValue: number;
  totalValue: number;
}

const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const WalletScoreCard = ({ cash, holdingsValue, totalValue }: WalletScoreCardProps) => {
  const holdingsPct = totalValue === 0 ? 0 : Math.round((holdingsValue / totalValue) * 100);

  return (
    <div className="glass-card p-6 animate-slide-in-right">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Wallet Balance</h3>
      </div>

      <div className="text-4xl font-bold text-foreground mb-2">
        {formatCurrency(totalValue)}
      </div>
      <p className="text-sm text-muted-foreground mb-4">Total equity (cash + holdings)</p>

      <div className="space-y-3 text-sm text-muted-foreground">
        <div className="flex justify-between">
          <span>Cash</span>
          <span className="text-foreground font-semibold">{formatCurrency(cash)}</span>
        </div>
        <div className="flex justify-between">
          <span>Holdings</span>
          <span className="text-foreground font-semibold">{formatCurrency(holdingsValue)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Allocation</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${holdingsPct}%` }}
              />
            </div>
            <span className="text-foreground font-semibold">{holdingsPct}% in holdings</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletScoreCard;

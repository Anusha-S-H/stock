import { useEffect, useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import HeroSection from '@/components/dashboard/HeroSection';
import StockSearch from '@/components/dashboard/StockSearch';
import CompanySummaryCard from '@/components/dashboard/CompanySummaryCard';
import SentimentRings from '@/components/dashboard/SentimentRings';
import StockChart from '@/components/dashboard/StockChart';
import StockPerformanceCard from '@/components/dashboard/StockPerformanceCard';
import WalletScoreCard from '@/components/dashboard/WalletScoreCard';
import AIStockPicks from '@/components/dashboard/AIStockPicks';
import { toast } from '@/components/ui/use-toast';

type ApiSentiment = [string, number];

type StockData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  sentiments: {
    positive: number;
    neutral: number;
    negative: number;
  };
  headlines: string[];
  history?: { date: string; price: number }[];
  prediction?: { date: string; price: number }[];
};

type Order = {
  id: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  timestamp: string;
  symbol: string;
};

type Position = {
  quantity: number;
  avgCost: number;
};

type ApiResponse = {
  company: string;
  symbol: string;
  headlines: string[];
  sentiments: ApiSentiment[];
  price: number | null;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  error?: string;
  history?: { date: string; price: number }[];
  prediction?: { date: string; price: number }[];
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const pastPerformance = [
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    buyPrice: 120,
    currentPrice: 240,
    currency: '$',
    accentColor: '#8B0000',
    glowColor: '#FF4444',
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    buyPrice: 160,
    currentPrice: 174,
    currency: '$',
    accentColor: '#ffffff',
    glowColor: '#22c55e',
  },
  {
    symbol: 'PAYTM',
    name: 'Paytm',
    buyPrice: 820,
    currentPrice: 430,
    currency: '₹',
    accentColor: '#1e40af',
    glowColor: '#ef4444',
  },
];

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [lastCompany, setLastCompany] = useState<string | null>(null);
  const [tradeQty, setTradeQty] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [position, setPosition] = useState<Position>({ quantity: 0, avgCost: 0 });
  const [cash, setCash] = useState(10000);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate state from localStorage on first load
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('orders_v1');
      const savedPosition = localStorage.getItem('position_v1');
      const savedCash = localStorage.getItem('cash_v1');

      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedPosition) setPosition(JSON.parse(savedPosition));
      if (savedCash) setCash(JSON.parse(savedCash));
    } catch (e) {
      console.error('Failed to hydrate state', e);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist state to localStorage when it changes (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('orders_v1', JSON.stringify(orders));
    localStorage.setItem('position_v1', JSON.stringify(position));
    localStorage.setItem('cash_v1', JSON.stringify(cash));
  }, [orders, position, cash, hydrated]);

  const updatePosition = (side: 'BUY' | 'SELL', qty: number, price: number) => {
    setPosition((prev) => {
      let nextPosition: Position;
      if (side === 'BUY') {
        const newQty = prev.quantity + qty;
        const newAvg = newQty === 0 ? 0 : (prev.avgCost * prev.quantity + price * qty) / newQty;
        nextPosition = { quantity: newQty, avgCost: newAvg };
      } else {
        const newQty = Math.max(prev.quantity - qty, 0);
        const newAvg = newQty === 0 ? 0 : prev.avgCost;
        nextPosition = { quantity: newQty, avgCost: newAvg };
      }
      const nextCash = side === 'BUY' ? cash - qty * price : cash + qty * price;
      setCash(nextCash);
      return nextPosition;
    });
  };

  const placeOrder = (side: 'BUY' | 'SELL') => {
    if (!stockData) {
      toast({ title: 'Select a company first', variant: 'destructive' });
      return;
    }
    if (tradeQty <= 0) {
      toast({ title: 'Enter a valid quantity', variant: 'destructive' });
      return;
    }
    if (side === 'BUY' && tradeQty * stockData.price > cash) {
      toast({ title: 'Not enough cash', description: 'Reduce quantity or sell holdings.', variant: 'destructive' });
      return;
    }
    const price = stockData.price || 0;
    const order: Order = {
      id: `${Date.now()}`,
      side,
      quantity: tradeQty,
      price,
      timestamp: new Date().toLocaleTimeString(),
      symbol: stockData.symbol,
    };
    setOrders((prev) => [order, ...prev].slice(0, 50));
    updatePosition(side, tradeQty, price);
    toast({
      title: `${side} order placed`,
      description: `${tradeQty} @ $${price.toFixed(2)} (${stockData.symbol})`,
    });
  };

  const fetchAnalysis = async (company: string, isBackground = false) => {
    if (!isBackground) {
      setIsLoading(true);
      setStockData(null);
    }

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Unable to analyze company right now.');
      }

      const sentimentTotals = data.sentiments.reduce(
        (acc, [label, score]) => {
          const normalizedLabel = label.toLowerCase();
          if (normalizedLabel === 'positive') acc.positive += score;
          else if (normalizedLabel === 'negative') acc.negative += score;
          else acc.neutral += score;
          acc.total += score;
          return acc;
        },
        { positive: 0, neutral: 0, negative: 0, total: 0 }
      );

      const toPercent = (value: number) =>
        sentimentTotals.total ? Math.round((value / sentimentTotals.total) * 100) : 0;

      setStockData({
        symbol: data.symbol,
        name: data.company,
        price: data.price ?? 0,
        change: 0,
        recommendation: data.recommendation,
        sentiments: {
          positive: toPercent(sentimentTotals.positive),
          neutral: toPercent(sentimentTotals.neutral),
          negative: toPercent(sentimentTotals.negative),
        },
        headlines: data.headlines,
        history: data.history ?? [],
        prediction: data.prediction ?? [],
      });
      setLastCompany(company);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.';
      toast({
        title: 'Analysis failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      if (!isBackground) setIsLoading(false);
    }
  };

  const handleSearch = async (company: string) => {
    await fetchAnalysis(company);
  };

  useEffect(() => {
    if (!lastCompany) return;
    const id = setInterval(() => fetchAnalysis(lastCompany, true), 30000);
    return () => clearInterval(id);
  }, [lastCompany]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <HeroSection />
        <StockSearch onSearch={handleSearch} isLoading={isLoading} />

        {stockData && (
          <div className="space-y-8 animate-fade-in">
            {/* Stock Analysis Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CompanySummaryCard
                symbol={stockData.symbol}
                name={stockData.name}
                price={stockData.price}
                change={stockData.change}
                recommendation={stockData.recommendation}
              />
              <SentimentRings
                positive={stockData.sentiments.positive}
                neutral={stockData.sentiments.neutral}
                negative={stockData.sentiments.negative}
              />
            </div>

            {/* Trading Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6 animate-fade-in-up">
                <h3 className="text-lg font-semibold text-foreground mb-4">Trade {stockData.symbol}</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      value={tradeQty}
                      onChange={(e) => setTradeQty(Number(e.target.value))}
                      className="input-neon mt-2 w-full"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="btn-neon px-4 py-2"
                      onClick={() => placeOrder('BUY')}
                    >
                      Buy @ ${stockData.price.toFixed(2)}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary px-4 py-2"
                      onClick={() => placeOrder('SELL')}
                    >
                      Sell @ ${stockData.price.toFixed(2)}
                    </button>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 animate-fade-in-up">
                <h3 className="text-lg font-semibold text-foreground mb-4">Position</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between"><span>Quantity</span><span>{position.quantity}</span></div>
                  <div className="flex justify-between"><span>Avg Cost</span><span>${position.avgCost.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Current Price</span><span>${stockData.price.toFixed(2)}</span></div>
                  <div className="flex justify-between font-semibold text-foreground">
                    <span>Current Value</span>
                    <span>${(position.quantity * stockData.price).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-foreground">
                    <span>Unrealized P&L</span>
                    <span>
                      ${((stockData.price - position.avgCost) * position.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* News & Chart placeholders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6 animate-fade-in-up">
                <h3 className="text-lg font-semibold text-foreground mb-4">Latest Headlines</h3>
                {stockData.headlines.length ? (
                  <ul className="space-y-3 list-disc list-inside text-muted-foreground">
                    {stockData.headlines.map((headline) => (
                      <li key={headline} className="text-sm leading-relaxed">
                        {headline}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No recent headlines available.</p>
                )}
              </div>

              <div className="space-y-6">
                <StockChart
                  data={stockData.history ?? []}
                  title="30-Day Stock Trend"
                  color="hsl(187, 100%, 50%)"
                />
                <StockChart
                  data={stockData.prediction ?? []}
                  title="AI Price Prediction"
                  color="hsl(270, 80%, 60%)"
                  showPrediction
                />
              </div>
            </div>

          </div>
        )}

        {/* Orders (persistent) */}
        <section className="mt-12">
          <div className="glass-card p-6 animate-fade-in-up">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Orders</h3>
            {orders.length === 0 ? (
              <p className="text-muted-foreground text-sm">No orders yet.</p>
            ) : (
              <div className="space-y-2">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center p-3 rounded-lg border border-border/50"
                  >
                    <div className="flex gap-3 items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.side === 'BUY' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
                        {order.side}
                      </span>
                      <div className="text-sm text-foreground">
                        {order.symbol} · {order.quantity} @ ${order.price.toFixed(2)}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{order.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Sidebar Widgets */}
        <section className="mt-12 grid grid-cols-1 lg-grid-cols-2 lg:grid-cols-2 gap-6">
          <WalletScoreCard
            cash={cash}
            holdingsValue={(stockData?.price ?? 0) * position.quantity}
            totalValue={cash + (stockData?.price ?? 0) * position.quantity}
          />
          <AIStockPicks />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

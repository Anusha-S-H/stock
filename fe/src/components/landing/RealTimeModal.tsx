import { useState } from 'react';
import { X, Search, Loader2 } from 'lucide-react';
import SentimentRings from '@/components/dashboard/SentimentRings';
import StockChart from '@/components/dashboard/StockChart';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Props {
  open: boolean;
  onClose: () => void;
}

type SentimentTuple = [string, number];

interface AnalyzeResponse {
  company: string;
  symbol: string;
  price: number | null;
  sentiments: SentimentTuple[];
  headlines: string[];
  history?: { date: string; price: number }[];
}

const RealTimeModal = ({ open, onClose }: Props) => {
  const [query, setQuery] = useState('AAPL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyzeResponse | null>(null);

  const fetchAnalysis = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: query.trim() }),
      });
      let payload: AnalyzeResponse;
      if (res.ok) {
        payload = await res.json();
      } else {
        // fallback to /predict if /analyze not available
        const res2 = await fetch(`${API_URL}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ company: query.trim() }),
        });
        if (!res2.ok) throw new Error('Unable to analyze right now');
        payload = await res2.json();
      }
      setData(payload);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const sentimentPercents = (sentiments: SentimentTuple[]) => {
    const totals = sentiments.reduce(
      (acc, [label, score]) => {
        const l = label.toLowerCase();
        if (l === 'positive') acc.pos += score;
        else if (l === 'negative') acc.neg += score;
        else acc.neu += score;
        acc.total += score;
        return acc;
      },
      { pos: 0, neu: 0, neg: 0, total: 0 }
    );
    const pct = (v: number) => (totals.total ? Math.round((v / totals.total) * 100) : 0);
    return { positive: pct(totals.pos), neutral: pct(totals.neu), negative: pct(totals.neg) };
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl glass-card p-6 rounded-2xl animate-scale-in">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Real-time Analysis</h3>
            <p className="text-sm text-muted-foreground">Live sentiment, price, and trends for any symbol.</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search company (e.g., AAPL, TSLA)"
              className="input-neon pl-10 pr-28 py-3 w-full"
            />
            <button
              onClick={fetchAnalysis}
              disabled={loading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:shadow-neon disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Analyze'}
            </button>
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>

        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="glass-card p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Company</p>
                  <p className="text-xl font-semibold text-foreground">{data.company}</p>
                  <p className="text-sm text-muted-foreground">{data.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase text-muted-foreground">Price</p>
                  <p className="text-2xl font-bold text-foreground">${(data.price ?? 0).toFixed(2)}</p>
                </div>
              </div>
              <SentimentRings {...sentimentPercents(data.sentiments)} />
            </div>

            <div className="glass-card p-4">
              <StockChart
                data={data.history ?? []}
                title="30-Day Stock Trend"
                color="hsl(187, 100%, 50%)"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimeModal;

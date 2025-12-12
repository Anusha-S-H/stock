import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface RiskResponse {
  risk: {
    score: number;
    category: string;
    reason: string;
  };
}

const RiskAssessmentModal = ({ open, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [risk, setRisk] = useState<RiskResponse['risk'] | null>(null);

  const loadRisk = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: 'AAPL' }),
      });
      if (!res.ok) throw new Error('Risk API unavailable');
      const payload = (await res.json()) as RiskResponse;
      if (payload && (payload as any).risk) {
        setRisk(payload.risk);
      } else {
        throw new Error('Unexpected response');
      }
    } catch (e) {
      // Fallback placeholder
      setRisk({ score: 62, category: 'Moderate', reason: 'Mixed sentiment and medium volatility.' });
      const msg = e instanceof Error ? e.message : 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const score = risk?.score ?? 62;
  const category = risk?.category ?? 'Moderate';
  const reason = risk?.reason ?? 'Mixed sentiment and medium volatility.';
  const rotation = (score / 100) * 180 - 90;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-xl glass-card p-6 rounded-2xl animate-scale-in">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Risk Radar</h3>
            <p className="text-sm text-muted-foreground">Assess portfolio risk with AI-driven scoring.</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="glass-card p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Risk Score</p>
              <p className="text-3xl font-bold text-foreground">{score}</p>
              <p className="text-sm text-muted-foreground">Category: {category}</p>
            </div>
            <div className="relative w-40 h-24">
              <svg className="w-full h-full" viewBox="0 0 100 60">
                <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="hsl(var(--border))" strokeWidth="8" strokeLinecap="round" />
                <path
                  d="M 10 55 A 40 40 0 0 1 90 55"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(score / 100) * 125.6} 125.6`}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div
                className="absolute bottom-0 left-1/2 w-1 h-12 bg-foreground origin-bottom transition-transform duration-700 ease-out rounded-full"
                style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-foreground" />
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{reason}</p>
        </div>

        {error && <p className="text-xs text-destructive mb-2">{error} (showing fallback)</p>}

        <div className="flex items-center justify-between">
          <button
            onClick={loadRisk}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:shadow-neon flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Analyze Portfolio Risk →
          </button>
          <span className="text-xs text-muted-foreground">Powered by AI insights</span>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentModal;

import { useState } from 'react';
import { ArrowRight, BookOpen, Lightbulb, Shield, Target, TrendingUp, Search } from 'lucide-react';

const tips = [
  {
    title: 'Understanding Stocks',
    body: 'A stock represents ownership in a company. When the company grows, your investment grows.',
    icon: <TrendingUp className="w-5 h-5" />,
    gradient: 'from-primary/20 via-primary/10 to-secondary/20',
    href: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/stock',
  },
  {
    title: 'What is a Stock Price?',
    body: 'Stock prices move based on demand, news, performance, and market trends.',
    icon: <Search className="w-5 h-5" />,
    gradient: 'from-secondary/20 via-secondary/10 to-accent/20',
    href: 'https://www.investopedia.com/terms/s/stockprice.asp',
  },
  {
    title: 'How to Start Investing',
    body: 'Begin with long-term, stable companies. Don’t invest money you cannot afford to lose.',
    icon: <Lightbulb className="w-5 h-5" />,
    gradient: 'from-accent/20 via-primary/10 to-success/20',
    href: 'https://www.investopedia.com/articles/basics/06/invest1000.asp',
  },
  {
    title: 'What is Risk?',
    body: 'High-risk stocks move fast and fluctuate. Low-risk stocks are more stable but grow slower.',
    icon: <Shield className="w-5 h-5" />,
    gradient: 'from-warning/20 via-warning/10 to-destructive/10',
    href: 'https://www.investopedia.com/terms/r/risk.asp',
  },
  {
    title: 'What is a Portfolio?',
    body: 'Your portfolio is the collection of all your investments, showing your total gains and losses.',
    icon: <BookOpen className="w-5 h-5" />,
    gradient: 'from-neon-blue/20 via-neon-purple/15 to-muted/30',
    href: 'https://www.investopedia.com/terms/p/portfolio.asp',
  },
];

const learnSections = [
  'Fundamental Analysis',
  'Technical Indicators',
  'Long-Term vs Short-Term Investing',
  'How AI helps in predicting markets',
];

const QuickGuide = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-10 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <span>📘</span> <span>Quick Guide for Beginners</span>
          </h3>
          <p className="text-sm text-muted-foreground">Learn the essentials of stocks and investing in a few cards.</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-primary text-primary-foreground hover:shadow-neon transition-all"
        >
          Learn the Basics <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tips.slice(0, 5).map((tip, idx) => (
          <a
            key={tip.title}
            href={tip.href}
            target="_blank"
            rel="noreferrer"
            className="glass-card-hover p-4 rounded-2xl border border-border/60 relative overflow-hidden group block"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${tip.gradient} opacity-60 group-hover:opacity-80 transition-opacity`}></div>
            <div className="relative flex gap-3 items-start">
              <div className="w-10 h-10 rounded-xl bg-background/70 border border-border/50 flex items-center justify-center text-primary shadow-glow-sm">
                {tip.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-foreground font-semibold text-sm">{idx + 1}️⃣ {tip.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.body}</p>
                <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Learn more modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}></div>
          <div className="relative w-full max-w-2xl glass-card p-6 animate-fade-in-up">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-foreground">Learn the Basics</h4>
                <p className="text-sm text-muted-foreground">Explore deeper topics to strengthen your investing foundation.</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {learnSections.map((item) => (
                <div key={item} className="p-4 rounded-xl bg-muted/50 border border-border/60 flex items-center gap-3">
                  <Target className="w-5 h-5 text-primary" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:shadow-neon transition-all"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default QuickGuide;

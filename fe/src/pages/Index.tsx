import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowRight, BarChart3, Shield, Zap } from 'lucide-react';
import ParticlesBackground from '@/components/ui/ParticlesBackground';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticlesBackground />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl" />

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center neon-glow-sm">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">StockSense</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="btn-neon"
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            AI-Powered Stock Predictions
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in-up">
            Predict the Market with{' '}
            <span className="gradient-text neon-text">AI Precision</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Get real-time stock analysis, sentiment insights, and AI-powered predictions 
            to make smarter investment decisions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={() => navigate('/signup')}
              className="btn-neon text-lg px-8 py-4 flex items-center gap-2 group"
            >
              Start Investing Smarter
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 rounded-xl border border-border text-foreground font-semibold hover:bg-muted/50 transition-all"
            >
              View Demo
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
          {[
            {
              icon: BarChart3,
              title: 'Real-time Analysis',
              description: 'Get instant insights from market data and news sentiment analysis.',
            },
            {
              icon: TrendingUp,
              title: 'AI Predictions',
              description: 'Advanced machine learning models predict stock movements with high accuracy.',
            },
            {
              icon: Shield,
              title: 'Risk Assessment',
              description: 'Understand your portfolio risk with comprehensive scoring and alerts.',
            },
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card-hover p-6 text-center animate-fade-in-up"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary mx-auto mb-4 flex items-center justify-center neon-glow-sm">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 StockSense. AI-powered investment insights.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

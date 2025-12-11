import { Sparkles, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const HeroSection = () => {
  const { profile } = useAuth();
  const displayName = profile?.full_name?.split(' ')[0] || 'Investor';
  
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mb-8 animate-fade-in-up">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Calendar className="w-4 h-4" />
        <span className="text-sm">{today}</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">
        Welcome back, <span className="gradient-text">{displayName}</span> 👋
      </h1>
      <p className="text-muted-foreground mt-2">
        Track your investments and discover new opportunities
      </p>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Portfolio Value</p>
            <p className="text-lg font-bold text-foreground">$24,532.00</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">AI Analyses</p>
            <p className="text-lg font-bold text-foreground">12 Today</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Gain</p>
            <p className="text-lg font-bold text-success">+18.5%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

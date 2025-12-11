import { ReactNode } from 'react';
import ParticlesBackground from '@/components/ui/ParticlesBackground';
import { TrendingUp } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <ParticlesBackground />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in-up">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center neon-glow">
              <TrendingUp className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold gradient-text">StockSense</h1>
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

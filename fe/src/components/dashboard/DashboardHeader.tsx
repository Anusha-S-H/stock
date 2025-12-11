import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ui/ThemeToggle';

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const displayName = profile?.full_name || 'Investor';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center neon-glow-sm">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">StockSense</span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 glass-card px-4 py-2 hover:border-primary/30 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-foreground">{initials}</span>
                </div>
                <span className="text-foreground font-medium hidden sm:block">{displayName}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 glass-card py-2 animate-fade-in">
                  <a href="#" className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                    <User className="w-4 h-4" />
                    Profile
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                    <Settings className="w-4 h-4" />
                    Settings
                  </a>
                  <hr className="my-2 border-border/50" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 text-destructive hover:bg-destructive/10 transition-colors w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

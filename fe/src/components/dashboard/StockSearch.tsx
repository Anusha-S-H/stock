import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface StockSearchProps {
  onSearch: (company: string) => void;
  isLoading: boolean;
}

const StockSearch = ({ onSearch, isLoading }: StockSearchProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="glass-card p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">AI Stock Analysis</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any company... (e.g., Apple, Tesla, Microsoft)"
            className="input-neon w-full pl-12 pr-32 py-4 text-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 btn-neon px-6 py-2 disabled:opacity-50"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              'Analyze'
            )}
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground mt-4">Analyzing market data...</p>
        </div>
      )}
    </div>
  );
};

export default StockSearch;

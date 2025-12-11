import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface StockChartProps {
  data: { date: string; price: number }[];
  title: string;
  color?: string;
  showPrediction?: boolean;
}

const StockChart = ({ data, title, color = 'hsl(187, 100%, 50%)', showPrediction = false }: StockChartProps) => {
  return (
    <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {showPrediction && (
          <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-medium">
            AI Prediction
          </span>
        )}
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 8%)',
                border: '1px solid hsl(222, 30%, 18%)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px hsl(222, 47%, 0%, 0.4)',
              }}
              labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
              itemStyle={{ color }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${title})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;

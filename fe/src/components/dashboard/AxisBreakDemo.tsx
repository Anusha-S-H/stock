import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data starting from 450
const data = [
  { x: 'A', y: 450 },
  { x: 'B', y: 520 },
  { x: 'C', y: 480 },
  { x: 'D', y: 600 },
  { x: 'E', y: 580 },
  { x: 'F', y: 650 },
  { x: 'G', y: 700 },
  { x: 'H', y: 720 },
];

const AxisBreakDemo = () => {
  return (
    <div className="w-full h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-foreground mb-2">Axis Break Demonstration</h1>
        <p className="text-muted-foreground mb-6">
          This chart uses an axis break to skip from 0 to 450, showing only the relevant data range.
          The zig-zag lines indicate where the axis is broken.
        </p>

        <div className="glass-card p-6 rounded-2xl">
          <div className="relative">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 60, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="x"
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: 'Category', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  domain={[450, 750]}
                  label={{ value: 'Value (with break at 0-450)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="y"
                  stroke="hsl(187, 100%, 50%)"
                  strokeWidth={2}
                  fill="url(#colorY)"
                />
              </AreaChart>
            </ResponsiveContainer>

            {/* Zig-zag axis break symbol */}
            <div className="absolute left-12 top-2 text-muted-foreground text-lg font-bold leading-none">
              <div>//</div>
              <div>//</div>
            </div>
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <p className="text-foreground font-semibold">Key Points:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>The y-axis starts at 450 instead of 0 to focus on the data range</li>
              <li>The "//" symbols indicate where the axis is broken (0-450 skipped)</li>
              <li>This avoids wasted space and emphasizes variations in the relevant range</li>
              <li>Useful when data has a natural minimum much higher than zero</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AxisBreakDemo;

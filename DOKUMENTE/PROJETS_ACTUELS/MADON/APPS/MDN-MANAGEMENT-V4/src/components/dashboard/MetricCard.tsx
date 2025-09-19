interface MetricCardProps {
  title: string;
  value: number;
  trend?: number;
  format: 'currency' | 'number' | 'percentage';
}

export function MetricCard({ title, value, trend, format }: MetricCardProps) {
  const formattedValue = formatValue(value, format);
  const formattedTrend = trend ? formatValue(trend, 'percentage') : null;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold">{formattedValue}</p>
        {trend && (
          <span className={`ml-2 text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '↑' : '↓'} {formattedTrend}
          </span>
        )}
      </div>
    </div>
  );
} 
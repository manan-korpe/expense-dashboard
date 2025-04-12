
import React from 'react';
import {
  AreaChart as RechartsAreaChart,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  Area,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

export interface ChartProps {
  data: any[];
  index: string;
  categories?: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  showGridLines?: boolean;
  startEndOnly?: boolean;
  showAnimation?: boolean;
  showGradient?: boolean;
  showTooltip?: boolean;
  stack?: boolean;
  className?: string;
  height?: string | number;
  category?: string;
}

export const AreaChart = ({
  data,
  index,
  categories = ['value'],
  colors = ['#8B5CF6'],
  valueFormatter = (value) => value.toString(),
  showLegend = true,
  showGridLines = true,
  startEndOnly = false,
  showAnimation = false,
  showGradient = false,
  showTooltip = true,
  className = '',
  height = 300
}: ChartProps) => {
  return (
    <div className={`w-full h-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {showGridLines && <CartesianGrid strokeDasharray="3 3" opacity={0.2} />}
          <XAxis 
            dataKey={index} 
            tickLine={!startEndOnly} 
            ticks={startEndOnly ? [data[0]?.[index], data[data.length - 1]?.[index]] : undefined}
          />
          <YAxis 
            tickFormatter={valueFormatter}
          />
          {showTooltip && <Tooltip formatter={(value) => valueFormatter(Number(value))} />}
          {showLegend && <Legend />}
          {categories.map((category, i) => (
            <Area
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[i % colors.length]}
              fill={colors[i % colors.length]}
              fillOpacity={showGradient ? 0.3 : 0.8}
              isAnimationActive={showAnimation}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BarChart = ({
  data,
  index,
  categories = ['value'],
  colors = ['#8B5CF6'],
  valueFormatter = (value) => value.toString(),
  stack = false,
  showLegend = true,
  showAnimation = false,
  showTooltip = true,
  className = '',
  height = 300
}: ChartProps) => {
  return (
    <div className={`w-full h-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey={index} />
          <YAxis tickFormatter={valueFormatter} />
          {showTooltip && <Tooltip formatter={(value) => valueFormatter(Number(value))} />}
          {showLegend && <Legend />}
          {categories.map((category, i) => (
            <Bar
              key={category}
              dataKey={category}
              fill={colors[i % colors.length]}
              stackId={stack ? 'stack' : undefined}
              isAnimationActive={showAnimation}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DonutChart = ({
  data,
  category = 'value',
  index = 'name',
  colors = ['#8B5CF6', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#6366F1', '#F97316'],
  valueFormatter = (value) => value.toString(),
  showAnimation = false,
  showTooltip = true,
  className = '',
  height = 250
}: ChartProps) => {
  return (
    <div className={`w-full h-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={5}
            dataKey={category}
            nameKey={index}
            isAnimationActive={showAnimation}
            label={({ name, percent }) => 
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || colors[index % colors.length]} 
              />
            ))}
          </Pie>
          {showTooltip && (
            <Tooltip 
              formatter={(value) => valueFormatter(Number(value))}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BarList = ({
  data,
  valueFormatter = (value) => value.toString(),
  showAnimation = false,
  className = '',
  height = 250
}: {
  data: { name: string; value: number }[];
  valueFormatter?: (value: number) => string;
  showAnimation?: boolean;
  className?: string;
  height?: string | number;
}) => {
  const barColors = ['#8B5CF6', '#F59E0B', '#10B981', '#3B82F6', '#EC4899'];
  
  return (
    <div className={`w-full h-full ${className}`} style={{ height }}>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-sm font-mono">
                {valueFormatter(item.value)}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${Math.min(100, (item.value / Math.max(...data.map(d => d.value))) * 100)}%`,
                  backgroundColor: barColors[index % barColors.length],
                  transition: showAnimation ? 'width 1s ease-out' : 'none'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

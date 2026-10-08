'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface MonthlyData {
  month: string;
  sales: number;
}

const defaultMonthlySales: MonthlyData[] = [
  { month: 'Jan', sales: 18500 },
  { month: 'Feb', sales: 22000 },
  { month: 'Mar', sales: 19800 },
  { month: 'Apr', sales: 28400 },
  { month: 'May', sales: 32100 },
  { month: 'Jun', sales: 26500 },
  { month: 'Jul', sales: 31000 },
  { month: 'Aug', sales: 34200 },
  { month: 'Sep', sales: 29000 },
  { month: 'Oct', sales: 36500 },
  { month: 'Nov', sales: 41000 },
  { month: 'Dec', sales: 48500 },
];

export function SalesBarChart({ data = defaultMonthlySales }: { data?: MonthlyData[] }) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94A3B8', fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '12px',
            }}
            formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Sales']}
          />
          <Bar
            dataKey="sales"
            fill="#2563EB"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface TrendDataPoint {
  date: string;
  enquiries: number;
  orders: number;
}

const defaultData: TrendDataPoint[] = [
  { date: 'Apr 1', enquiries: 34, orders: 18 },
  { date: 'Apr 4', enquiries: 45, orders: 25 },
  { date: 'Apr 7', enquiries: 60, orders: 40 },
  { date: 'Apr 11', enquiries: 45, orders: 30 },
  { date: 'Apr 14', enquiries: 63, orders: 40 },
  { date: 'Apr 18', enquiries: 51, orders: 32 },
  { date: 'Apr 21', enquiries: 48, orders: 30 },
  { date: 'Apr 25', enquiries: 58, orders: 40 },
  { date: 'Apr 28', enquiries: 52, orders: 35 },
];

export function TrendLineChart({ data = defaultData }: { data?: TrendDataPoint[] }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E0D3" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8C8275', fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8C8275', fontSize: 11 }}
            domain={[0, 80]}
            ticks={[0, 20, 40, 60, 80]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0D281E',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '12px',
            }}
          />
          <Line
            type="monotone"
            dataKey="enquiries"
            name="Enquiries"
            stroke="#1B4D3E"
            strokeWidth={2.5}
            dot={{ fill: '#1B4D3E', r: 4 }}
            activeDot={{ r: 6, fill: '#1B4D3E' }}
          />
          <Line
            type="monotone"
            dataKey="orders"
            name="Orders"
            stroke="#B58A43"
            strokeWidth={2.5}
            dot={{ fill: '#B58A43', r: 4 }}
            activeDot={{ r: 6, fill: '#B58A43' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

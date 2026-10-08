'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface ProductShare {
  name: string;
  value: number;
  color: string;
}

const defaultProductData: ProductShare[] = [
  { name: 'Shopping Bags', value: 37, color: '#2563EB' },
  { name: 'Tote Bags', value: 22, color: '#06B6D4' },
  { name: 'Bottle Bags', value: 15, color: '#10B981' },
  { name: 'Burlap Sacks', value: 13, color: '#F59E0B' },
  { name: 'Others', value: 13, color: '#64748B' },
];

export function ProductDonutChart({
  data = defaultProductData,
  totalOrders = 54,
}: {
  data?: ProductShare[];
  totalOrders?: number;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Donut Chart with Center Text */}
      <div className="relative w-44 h-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(val: any) => [`${val}%`, 'Share']}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Central Counter Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-slate-900 leading-none">{totalOrders}</span>
          <span className="text-[10px] text-slate-400 font-medium mt-1">Total Orders</span>
        </div>
      </div>

      {/* Legend List */}
      <div className="flex-1 space-y-2 w-full">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 font-medium truncate">{item.name}</span>
            </div>
            <span className="font-bold text-slate-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

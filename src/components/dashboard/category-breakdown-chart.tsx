'use client';

import * as React from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Intervention, Category } from '@/lib/types';

interface CategoryBreakdownChartProps {
  interventions: Intervention[];
}

export function CategoryBreakdownChart({ interventions }: CategoryBreakdownChartProps) {
  const data = React.useMemo(() => {
    const categoryCounts = interventions.reduce((acc, inter) => {
      acc[inter.category] = (acc[inter.category] || 0) + 1;
      return acc;
    }, {} as Record<Category, number>);

    return Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      total: value,
    })).sort((a,b) => b.total - a.total);
  }, [interventions]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={80} />
          <Tooltip
             cursor={{ fill: 'hsl(var(--muted))' }}
             contentStyle={{
                background: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
             }}
          />
          <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} name="Total">
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

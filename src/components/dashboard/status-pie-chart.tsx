'use client';

import * as React from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import type { Intervention } from '@/lib/types';

interface StatusPieChartProps {
  interventions: Intervention[];
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function StatusPieChart({ interventions }: StatusPieChartProps) {
  const statusCounts = {
    'En attente': interventions.filter(i => i.status === 'En attente').length,
    'En cours': interventions.filter(i => i.status === 'En cours').length,
    'Clôturée': interventions.filter(i => i.status === 'Clôturée').length,
  };

  const data = [
    { name: 'En attente', value: statusCounts['En attente'], color: 'hsl(var(--chart-1))' },
    { name: 'En cours', value: statusCounts['En cours'], color: 'hsl(var(--chart-2))' },
    { name: 'Clôturée', value: statusCounts['Clôturée'], color: 'hsl(var(--chart-3))' },
  ].filter(d => d.value > 0);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))' }}
            contentStyle={{
              background: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              borderRadius: 'var(--radius)',
            }}
          />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
       <div className="flex justify-center space-x-4 text-sm">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span>{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

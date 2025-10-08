'use client';

import * as React from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import type { Intervention, User } from '@/lib/types';
import { Card, CardContent } from '../ui/card';

interface TechnicianPerformanceChartProps {
  interventions: Intervention[];
  technicians: User[];
}

export function TechnicianPerformanceChart({ interventions, technicians }: TechnicianPerformanceChartProps) {
  const data = React.useMemo(() => {
    const techMap = new Map(technicians.map(t => [t.id, t.name]));
    
    const performance = interventions
      .filter(inter => inter.status === 'Clôturée' && inter.assignedTo)
      .reduce((acc, inter) => {
        if (techMap.has(inter.assignedTo)) {
            acc[inter.assignedTo] = (acc[inter.assignedTo] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(performance)
        .map(([techId, closedCount]) => ({
            name: techMap.get(techId) || 'Inconnu',
            total: closedCount,
        }))
        .sort((a, b) => b.total - a.total);

  }, [interventions, technicians]);

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        <p>Aucune donnée de performance disponible.</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" hide />
           <Tooltip
             cursor={{ fill: 'hsl(var(--muted))' }}
             contentStyle={{
                background: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
             }}
          />
          <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]}>
            <LabelList dataKey="name" position="insideLeft" offset={8} className="fill-primary-foreground" />
            <LabelList dataKey="total" position="right" offset={8} className="fill-foreground" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

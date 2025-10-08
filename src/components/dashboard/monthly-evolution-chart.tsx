'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Intervention } from '@/lib/types';
import { subMonths, format, startOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MonthlyEvolutionChartProps {
  interventions: Intervention[];
}

export function MonthlyEvolutionChart({ interventions }: MonthlyEvolutionChartProps) {
  const data = React.useMemo(() => {
    const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));
    const monthlyData: Record<string, { name: string; created: number; closed: number }> = {};

    // Initialize last 6 months
    for (let i = 0; i < 6; i++) {
      const month = startOfMonth(subMonths(new Date(), i));
      const monthKey = format(month, 'yyyy-MM');
      const monthName = format(month, 'MMM yy', { locale: fr });
      monthlyData[monthKey] = { name: monthName.charAt(0).toUpperCase() + monthName.slice(1), created: 0, closed: 0 };
    }

    interventions.forEach(inter => {
      const interDate = new Date(inter.date);
      if (interDate >= sixMonthsAgo) {
        const monthKey = format(interDate, 'yyyy-MM');
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].created += 1;
          if (inter.status === 'Clôturée') {
            monthlyData[monthKey].closed += 1;
          }
        }
      }
    });

    return Object.values(monthlyData).reverse();
  }, [interventions]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip 
             cursor={{ fill: 'hsl(var(--muted))' }}
             contentStyle={{
                background: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
             }}
          />
          <Legend wrapperStyle={{paddingTop: '20px'}}/>
          <Bar dataKey="created" fill="hsl(var(--chart-1))" name="Créées" radius={[4, 4, 0, 0]} />
          <Bar dataKey="closed" fill="hsl(var(--chart-2))" name="Clôturées" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import { useUser } from '@/contexts/user-context';
import { useDashboard } from '../layout.client';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusPieChart } from '@/components/dashboard/status-pie-chart';
import { MonthlyEvolutionChart } from '@/components/dashboard/monthly-evolution-chart';
import { CategoryBreakdownChart } from '@/components/dashboard/category-breakdown-chart';
import { TechnicianPerformanceChart } from '@/components/dashboard/technician-performance-chart';

export default function StatisticsPage() {
  const { user } = useUser();
  const { interventions, users } = useDashboard();

  const interventionsForUser = useMemo(() => {
    if (user.role === 'Technicien') {
      return interventions.filter(inter => inter.assignedTo === user.id);
    }
    return interventions;
  }, [user, interventions]);

  const technicians = useMemo(() => users.filter(u => u.role === 'Technicien'), [users]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Statistiques</h2>
        <p className="text-muted-foreground">
          Visualisez les données clés et les tendances sur les interventions.
        </p>
      </div>

      <StatsCards interventions={interventionsForUser} users={users} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Évolution mensuelle</CardTitle>
            <CardDescription>
              Courbe des interventions créées vs. clôturées sur les 6 derniers mois.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <MonthlyEvolutionChart interventions={interventionsForUser} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Répartition par statut</CardTitle>
            <CardDescription>
              Distribution des interventions actives et passées.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StatusPieChart interventions={interventionsForUser} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
           <CardHeader>
            <CardTitle>Répartition par type d'intervention</CardTitle>
            <CardDescription>
                Histogramme des interventions par catégorie.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryBreakdownChart interventions={interventionsForUser} />
          </CardContent>
        </Card>
        <Card>
           <CardHeader>
            <CardTitle>Performance des techniciens</CardTitle>
            <CardDescription>
                Classement par nombre d'interventions clôturées.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TechnicianPerformanceChart interventions={interventionsForUser} technicians={technicians} />
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

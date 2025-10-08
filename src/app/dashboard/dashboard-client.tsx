'use client';

import { useMemo } from 'react';
import type { Intervention, User } from '@/lib/types';
import { useUser } from '@/contexts/user-context';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowRight, Loader2 } from 'lucide-react';
import { StatusPieChart } from '@/components/dashboard/status-pie-chart';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { LatestInterventionsTable } from '@/components/dashboard/latest-interventions-table';
import { AlertsWidget } from '@/components/dashboard/alerts-widget';
import Link from 'next/link';
import { useDashboard } from './layout.client';

export function DashboardClient() {
  const { user } = useUser();
  const { interventions, users, setCreatingIntervention } = useDashboard();

  const allInterventionsForUser = useMemo(() => {
     if (!user) return [];
     if (user.role === 'Technicien') {
      return interventions.filter(inter => inter.assignedTo === user.id);
    }
    return interventions;
  }, [interventions, user]);
  
  const sortedInterventions = useMemo(() => {
    return [...allInterventionsForUser].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [allInterventionsForUser]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const canCreate = user.role === 'Administrateur' || user.role === 'Agent de support';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tableau de bord</h2>
          <p className="text-muted-foreground">
            Vue d'ensemble des interventions et des indicateurs clés.
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setCreatingIntervention(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Créer une intervention
          </Button>
        )}
      </div>

      <StatsCards interventions={allInterventionsForUser} users={users} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 grid gap-6">
            <AlertsWidget interventions={allInterventionsForUser} />
            <Card>
                <CardHeader>
                    <CardTitle>Dernières interventions</CardTitle>
                    <CardDescription>Les 5 dernières interventions créées.</CardDescription>
                </CardHeader>
                <CardContent>
                    <LatestInterventionsTable interventions={sortedInterventions.slice(0, 5)} users={users} />
                </CardContent>
                <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                        <Link href="/dashboard/interventions">
                            Voir toutes les interventions
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
        <div className="lg:col-span-2 grid gap-6">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Répartition par statut</CardTitle>
                <CardDescription>Distribution de toutes les interventions.</CardDescription>
              </CardHeader>
              <CardContent>
                <StatusPieChart interventions={allInterventionsForUser} />
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

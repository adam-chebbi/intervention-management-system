'use client';

import { useState, useMemo } from 'react';
import type { Intervention, User, Status } from '@/lib/types';
import { useUser } from '@/contexts/user-context';
import { InterventionTable } from '@/components/dashboard/intervention-table';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowRight } from 'lucide-react';
import { CreateInterventionDialog } from '@/components/dashboard/create-intervention-dialog';
import { StatusPieChart } from './status-pie-chart';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../ui/card';
import { LatestInterventionsTable } from './latest-interventions-table';
import { AlertsWidget } from './alerts-widget';
import Link from 'next/link';

interface DashboardClientProps {
  interventions: Intervention[];
  users: User[];
}

export function DashboardClient({ interventions: initialInterventions, users }: DashboardClientProps) {
  const { user } = useUser();
  const [interventions, setInterventions] = useState<Intervention[]>(initialInterventions);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  const technicians = useMemo(() => users.filter(u => u.role === 'Technicien'), [users]);

  const allInterventionsForUser = useMemo(() => {
     if (user.role === 'Technicien') {
      return interventions.filter(inter => inter.assignedTo === user.id);
    }
    return interventions;
  }, [interventions, user]);
  
  const sortedInterventions = useMemo(() => {
    return [...allInterventionsForUser].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [allInterventionsForUser]);


  const handleCreateIntervention = (newIntervention: Intervention) => {
    setInterventions(prev => [newIntervention, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

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
          <Button onClick={() => setCreateDialogOpen(true)}>
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
        <Card className="lg:col-span-2 h-fit">
          <CardHeader>
            <CardTitle>Répartition par statut</CardTitle>
            <CardDescription>Distribution de toutes les interventions.</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusPieChart interventions={allInterventionsForUser} />
          </CardContent>
        </Card>
      </div>

      {canCreate && (
          <CreateInterventionDialog
            isOpen={isCreateDialogOpen}
            setIsOpen={setCreateDialogOpen}
            technicians={technicians}
            onCreate={handleCreateIntervention}
          />
      )}
    </div>
  );
}

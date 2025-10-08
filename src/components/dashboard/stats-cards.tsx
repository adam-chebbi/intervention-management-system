import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, LoaderCircle, CheckCircle, Users } from 'lucide-react';
import type { Intervention, User } from '@/lib/types';

interface StatsCardsProps {
  interventions: Intervention[];
  users: User[];
}

export function StatsCards({ interventions, users }: StatsCardsProps) {
  const enCours = interventions.filter(i => i.status === 'En cours').length;
  const enAttente = interventions.filter(i => i.status === 'En attente' && !i.assignedTo).length;
  
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const clotureesCeMois = interventions.filter(i => 
    i.status === 'Clôturée' && new Date(i.date) >= startOfMonth
  ).length;

  const techniciensActifs = users.filter(u => u.role === 'Technicien').length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En cours</CardTitle>
          <LoaderCircle className="h-4 w-4 text-muted-foreground animate-spin" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{enCours}</div>
          <p className="text-xs text-muted-foreground">Interventions actuellement prises en charge.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clôturées (ce mois)</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{clotureesCeMois}</div>
          <p className="text-xs text-muted-foreground">Depuis le début du mois.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En attente d'affectation</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{enAttente}</div>
          <p className="text-xs text-muted-foreground">Interventions non assignées.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Techniciens Actifs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{techniciensActifs}</div>
          <p className="text-xs text-muted-foreground">Techniciens disponibles.</p>
        </CardContent>
      </Card>
    </div>
  );
}

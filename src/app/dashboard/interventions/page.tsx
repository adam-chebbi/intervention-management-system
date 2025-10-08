'use client';

import { useState, useMemo } from 'react';
import type { Intervention, User, Status } from '@/lib/types';
import { useUser } from '@/contexts/user-context';
import { InterventionTable } from '@/components/dashboard/intervention-table';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileSpreadsheet, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDashboard } from '../layout.client';
import { generateInterventionsCSV } from '@/lib/csv-generator';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';


const statusFilters: Status[] = ['En attente', 'En cours', 'Clôturée'];

export default function InterventionsPage() {
  const { user } = useUser();
  const { interventions, users, setCreatingIntervention } = useDashboard();
  
  const [selectedStatus, setSelectedStatus] = useState<Status | 'all'>('all');
  
  const technicians = useMemo(() => users.filter(u => u.role === 'Technicien'), [users]);

  const unassignedInterventions = useMemo(() => {
    if (user.role === 'Technicien') return []; // Technicians don't need to see this
    return interventions.filter(inter => !inter.assignedTo);
  }, [interventions, user.role]);

  const filteredInterventions = useMemo(() => {
    let items = interventions;

    if (user.role === 'Technicien') {
      items = items.filter(inter => inter.assignedTo === user.id);
    }

    if (selectedStatus !== 'all') {
      items = items.filter(inter => inter.status === selectedStatus);
    }

    return items;
  }, [interventions, user, selectedStatus]);

  const canCreate = user.role === 'Administrateur' || user.role === 'Agent de support';
  const canExport = user.role === 'Administrateur';
  const canSeeUnassigned = user.role !== 'Technicien';

  const handleExportCSV = () => {
    generateInterventionsCSV(filteredInterventions, users, selectedStatus);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion des interventions</h2>
          <p className="text-muted-foreground">
            Affichez, filtrez et gérez toutes les interventions.
          </p>
        </div>
        <div className="flex gap-2">
            {canCreate && (
            <Button onClick={() => setCreatingIntervention(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Créer une intervention
            </Button>
            )}
            {canExport && (
                 <Button variant="outline" onClick={handleExportCSV}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Télécharger en CSV
                </Button>
            )}
        </div>
      </div>
      
      {canSeeUnassigned && unassignedInterventions.length > 0 && (
        <Card className="border-amber-500/50">
           <CardHeader>
             <div className="flex items-center gap-3">
               <AlertTriangle className="h-6 w-6 text-amber-500" />
                <div>
                    <CardTitle>Interventions non assignées</CardTitle>
                    <CardDescription>
                        Ces interventions nécessitent l'assignation d'un technicien.
                    </CardDescription>
                </div>
             </div>
          </CardHeader>
          <CardContent>
            <InterventionTable interventions={unassignedInterventions} users={users} />
          </CardContent>
        </Card>
      )}


      <div>
        <Tabs defaultValue="all" onValueChange={(value) => setSelectedStatus(value as Status | 'all')}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            {statusFilters.map(status => (
              <TabsTrigger key={status} value={status}>{status}</TabsTrigger>
            ))}
          </TabsList>
          {/* We create a TabsContent for each status to ensure the table re-renders on tab change.
              The key prop is crucial here for re-mounting the component. */}
          <TabsContent value={selectedStatus} key={selectedStatus}>
            <InterventionTable interventions={filteredInterventions} users={users} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

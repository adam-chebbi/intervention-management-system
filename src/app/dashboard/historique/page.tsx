'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Intervention, User, Region } from '@/lib/types';
import { InterventionTable } from '@/components/dashboard/intervention-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { useDashboard } from '../layout.client';
import { Loader2 } from 'lucide-react';

const regions: Region[] = ['Tunis', 'Sfax', 'Sousse', 'Ariana', 'Ben Arous', 'Nabeul'];

export default function HistoryPage() {
  const { interventions, users, isPending } = useDashboard();
  const [filters, setFilters] = useState<{
    query: string;
    region: string;
    dateFrom?: Date;
    dateTo?: Date;
  }>({
    query: '',
    region: 'all',
  });

  const filteredInterventions = useMemo(() => {
    return interventions.filter(intervention => {
      const queryMatch =
        filters.query === '' ||
        intervention.id.toLowerCase().includes(filters.query.toLowerCase()) ||
        intervention.clientName.toLowerCase().includes(filters.query.toLowerCase()) ||
        intervention.address.toLowerCase().includes(filters.query.toLowerCase());
      
      const regionMatch = filters.region === 'all' || intervention.region === filters.region;

      const date = new Date(intervention.date);
      const dateFromMatch = !filters.dateFrom || date >= filters.dateFrom;
      const dateToMatch = !filters.dateTo || date <= filters.dateTo;
      
      return queryMatch && regionMatch && dateFromMatch && dateToMatch;
    }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [interventions, filters]);
  
  const handleResetFilters = () => {
    setFilters({ query: '', region: 'all', dateFrom: undefined, dateTo: undefined });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Historique des interventions</h2>
        <p className="text-muted-foreground">
          Consultez, filtrez et recherchez dans toutes les interventions passées.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres de recherche</CardTitle>
          <CardDescription>
            Affinez votre recherche à l'aide des filtres ci-dessous.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                    placeholder="Rechercher par ID, client, adresse..."
                    value={filters.query}
                    onChange={(e) => setFilters(prev => ({...prev, query: e.target.value}))}
                />
                 <Select
                    value={filters.region}
                    onValueChange={(value) => setFilters(prev => ({...prev, region: value}))}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filtrer par région" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes les régions</SelectItem>
                        {regions.map(region => (
                            <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <DatePicker
                    date={filters.dateFrom}
                    setDate={(date) => setFilters(prev => ({...prev, dateFrom: date}))}
                    placeholder="Date de début"
                />
                 <DatePicker
                    date={filters.dateTo}
                    setDate={(date) => setFilters(prev => ({...prev, dateTo: date}))}
                    placeholder="Date de fin"
                />
            </div>
            <Button onClick={handleResetFilters} variant="ghost">Réinitialiser les filtres</Button>
        </CardContent>
      </Card>
      
       {isPending ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <InterventionTable interventions={filteredInterventions} users={users} />
        )}
    </div>
  );
}

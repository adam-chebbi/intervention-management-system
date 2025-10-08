'use client'

import * as React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Intervention, User, Status } from '@/lib/types';
import { Button } from '../ui/button';
import { Clock, LoaderCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig: Record<Status, { icon: React.ElementType, className: string }> = {
    'En attente': { icon: Clock, className: 'bg-red-500/10 text-red-600 border-red-500/20' },
    'En cours': { icon: LoaderCircle, className: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
    'Clôturée': { icon: CheckCircle, className: 'bg-green-500/10 text-green-600 border-green-500/20' },
};

interface LatestInterventionsTableProps {
  interventions: Intervention[];
  users: User[];
}

export function LatestInterventionsTable({ interventions, users }: LatestInterventionsTableProps) {
  const usersMap = React.useMemo(() => new Map(users.map(user => [user.id, user.name])), [users]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Région</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Technicien</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {interventions.map((intervention) => {
          const StatusIcon = statusConfig[intervention.status].icon;
          return (
            <TableRow key={intervention.id}>
              <TableCell className="font-medium">{intervention.id}</TableCell>
              <TableCell>{intervention.region}</TableCell>
              <TableCell>{new Date(intervention.date).toLocaleDateString('fr-FR')}</TableCell>
              <TableCell>
                <Badge variant="outline" className={cn("gap-1.5", statusConfig[intervention.status].className)}>
                    <StatusIcon className={cn("h-3 w-3", intervention.status === 'En cours' && 'animate-spin')}/>
                    <span>{intervention.status}</span>
                </Badge>
              </TableCell>
              <TableCell>{usersMap.get(intervention.assignedTo) || <span className='text-muted-foreground italic'>Non assigné</span>}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

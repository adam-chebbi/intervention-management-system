
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil, Trash2, CheckCircle, PlayCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import type { Intervention, Status } from '@/lib/types';
import { useDashboard } from '@/app/dashboard/layout.client';

interface DataTableRowActionsProps {
  intervention: Intervention;
}

export function DataTableRowActions({ intervention }: DataTableRowActionsProps) {
  const { setEditingIntervention, setDeletingIntervention, updateInterventionStatus } = useDashboard();

  const handleStatusChange = (status: Status) => {
    updateInterventionStatus(intervention.id, status);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Ouvrir le menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
            <Link href={`/dashboard/interventions/${intervention.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Voir les détails
            </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setEditingIntervention(intervention)}>
            <Pencil className="mr-2 h-4 w-4" />
            Modifier
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                Changer le statut
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                 <DropdownMenuItem onClick={() => handleStatusChange('En attente')}>
                    <Clock className="mr-2 h-4 w-4" />
                    En attente
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('En cours')}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    En cours
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('Clôturée')}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Clôturée
                </DropdownMenuItem>
            </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive" onClick={() => setDeletingIntervention(intervention)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

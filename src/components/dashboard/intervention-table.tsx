'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Intervention, User, Status, Category, Priority } from '@/lib/types';
import { DataTableRowActions } from './data-table-row-actions';
import {
  TriangleAlert,
  PlugZap,
  ClipboardList,
  Wrench,
  HelpCircle,
  Clock,
  LoaderCircle,
  CheckCircle,
  ShieldAlert,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


const categoryIcons: Record<Category, React.ElementType> = {
  Pannes: TriangleAlert,
  Branchements: PlugZap,
  Relevés: ClipboardList,
  Maintenance: Wrench,
  Autre: HelpCircle,
};

const statusConfig: Record<Status, { icon: React.ElementType, className: string }> = {
    'En attente': { icon: Clock, className: 'bg-red-500/10 text-red-600 border-red-500/20' },
    'En cours': { icon: LoaderCircle, className: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
    'Clôturée': { icon: CheckCircle, className: 'bg-green-500/10 text-green-600 border-green-500/20' },
};

const priorityIcons: Record<Priority, React.ElementType> = {
  'Normale': Shield,
  'Urgente': ShieldAlert,
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}


interface InterventionTableProps {
  interventions: Intervention[];
  users: User[];
}

export function InterventionTable({ interventions, users }: InterventionTableProps) {
  const usersMap = React.useMemo(() => new Map(users.map(user => [user.id, user])), [users]);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden md:table-cell">Priorité</TableHead>
            <TableHead>Client & Région</TableHead>
            <TableHead className="hidden sm:table-cell">Catégorie</TableHead>
            <TableHead className="hidden lg:table-cell">Technicien Assigné</TableHead>
            <TableHead className="hidden lg:table-cell">Créée le</TableHead>
            <TableHead className="hidden md:table-cell">Mise à jour le</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interventions.length > 0 ? (
            interventions.map((intervention) => {
              const assignedUser = usersMap.get(intervention.assignedTo);
              const CategoryIcon = categoryIcons[intervention.category] || HelpCircle;
              const StatusIcon = statusConfig[intervention.status].icon;
              const PriorityIcon = priorityIcons[intervention.priority] || Shield;
              
              return (
                <TableRow key={intervention.id}>
                    <TableCell className="hidden md:table-cell">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <PriorityIcon className={cn("h-5 w-5", intervention.priority === 'Urgente' ? 'text-destructive' : 'text-muted-foreground')} />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Priorité: {intervention.priority}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </TableCell>
                  <TableCell>
                    <div className="font-medium">{intervention.clientName}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[150px] sm:max-w-xs">{intervention.region} - {intervention.address}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                     <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <div className="flex items-center gap-2">
                            <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                            <span className='hidden lg:inline'>{intervention.category}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Catégorie: {intervention.category}</p>
                          <p className="text-xs text-muted-foreground">ID: {intervention.id}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{assignedUser?.name || <span className="text-muted-foreground italic">Non assigné</span>}</TableCell>
                  <TableCell className="hidden lg:table-cell">{formatDate(intervention.date)}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(intervention.lastUpdated)}</TableCell>
                  <TableCell>
                     <Badge variant="outline" className={cn("gap-1.5", statusConfig[intervention.status].className)}>
                        <StatusIcon className={cn("h-3 w-3", intervention.status === 'En cours' && 'animate-spin')}/>
                        <span className="hidden sm:inline">{intervention.status}</span>
                     </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DataTableRowActions intervention={intervention} />
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Aucune intervention trouvée.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

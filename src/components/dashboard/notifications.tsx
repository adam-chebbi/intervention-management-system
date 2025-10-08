
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, Check } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/app/dashboard/layout.client';
import { useUser } from '@/contexts/user-context';
import { useToast } from '@/hooks/use-toast';
import type { Intervention } from '@/lib/types';
import Link from 'next/link';

type Notification = {
  id: string;
  title: string;
  description: string;
  href: string;
  timestamp: number;
};

export function Notifications() {
  const { user } = useUser();
  const { interventions } = useDashboard();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  
  const previousInterventionsRef = useRef<Intervention[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 10)); // Keep last 10
    setHasUnread(true);

    toast({
      title: newNotification.title,
      description: (
        <Link href={newNotification.href} className="underline">
          {newNotification.description}
        </Link>
      ),
      duration: 10000,
    });
  }, [toast]);
  

  useEffect(() => {
    if (!interventions || interventions.length === 0 || !user) return;

    const previousInterventions = previousInterventionsRef.current;
    
    // Don't run on initial load
    if (previousInterventions.length === 0) {
        previousInterventionsRef.current = interventions;
        return;
    }
    
    const previousInterventionMap = new Map(previousInterventions.map(i => [i.id, i]));
    
    interventions.forEach(currentIntervention => {
        const previousVersion = previousInterventionMap.get(currentIntervention.id);

        // 1. New intervention created
        if (!previousVersion && (user.role === 'Administrateur' || user.role === 'Agent de support')) {
             addNotification({
                title: 'Nouvelle Intervention Créée',
                description: `ID: ${currentIntervention.id} pour ${currentIntervention.clientName}`,
                href: `/dashboard/interventions/${currentIntervention.id}`,
            });
            // Specific alert for URGENT and UNASSIGNED
            if (currentIntervention.priority === 'Urgente' && !currentIntervention.assignedTo) {
                 addNotification({
                    title: 'ALERTE: Intervention Urgente',
                    description: `L'intervention urgente ${currentIntervention.id} nécessite une assignation.`,
                    href: `/dashboard/interventions/${currentIntervention.id}`,
                });
            }
        }
        
        else if (previousVersion) {
            // 2. Intervention assigned to the current user (technician)
            if (!previousVersion.assignedTo && currentIntervention.assignedTo === user.id) {
                addNotification({
                    title: 'Nouvelle Assignation',
                    description: `L'intervention ${currentIntervention.id} vous a été assignée.`,
                    href: `/dashboard/interventions/${currentIntervention.id}`,
                });
            }

            // 3. Intervention status changed to "Clôturée"
            if (
                previousVersion.status !== 'Clôturée' && 
                currentIntervention.status === 'Clôturée' &&
                (user.role === 'Administrateur' || user.role === 'Agent de support')
            ) {
               addNotification({
                    title: 'Intervention Clôturée',
                    description: `L'intervention ${currentIntervention.id} a été clôturée.`,
                    href: `/dashboard/interventions/${currentIntervention.id}`,
                });
            }
        }
    });

    previousInterventionsRef.current = interventions;

  }, [interventions, user, addNotification]);
  
  const markAllAsRead = () => {
    setHasUnread(false);
  };

  return (
    <Popover onOpenChange={(open) => { if(!open) { markAllAsRead() }}}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="flex justify-between items-center p-4 border-b">
            <h4 className="font-medium text-sm">Notifications</h4>
            <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={!hasUnread}>
                <Check className="mr-2 h-4 w-4"/>
                Marquer comme lues
            </Button>
        </div>
        <div className="p-2 max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
                 <p className="text-center text-sm text-muted-foreground py-8">Aucune notification pour le moment.</p>
            ) : (
                <div className="flex flex-col gap-1">
                    {notifications.map(notif => (
                        <Link key={notif.id} href={notif.href} className="block p-2 rounded-md hover:bg-accent transition-colors">
                             <p className="font-semibold text-sm">{notif.title}</p>
                             <p className="text-sm text-muted-foreground">{notif.description}</p>
                             <p className="text-xs text-muted-foreground/80 mt-1">{new Date(notif.timestamp).toLocaleTimeString('fr-FR')}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

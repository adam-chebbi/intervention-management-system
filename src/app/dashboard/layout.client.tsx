

'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { SidebarNav } from '@/components/dashboard/sidebar-nav';
import React, { createContext, useContext, useState, useMemo, useTransition, useEffect } from 'react';
import type { Intervention, User, Status, Role } from '@/lib/types';
import { CreateInterventionDialog } from '@/components/dashboard/create-intervention-dialog';
import { useToast } from '@/hooks/use-toast';
import { EditInterventionDialog } from '@/components/dashboard/edit-intervention-dialog';
import { DeleteInterventionDialog } from '@/components/dashboard/delete-intervention-dialog';
import { usePathname, useRouter } from 'next/navigation';
import { CreateUserDialog } from '@/components/dashboard/create-user-dialog';
import { EditUserDialog } from '@/components/dashboard/edit-user-dialog';
import { DeleteUserDialog } from '@/components/dashboard/delete-user-dialog';
import { 
  createInterventionAction, 
  updateInterventionAction,
  deleteInterventionAction 
} from '@/actions/intervention-actions';
import {
  createUserAction,
  updateUserAction,
  deleteUserAction,
} from '@/actions/user-actions';
import { useUser } from '@/contexts/user-context';


interface DashboardContextType {
  interventions: Intervention[];
  users: User[];
  
  createIntervention: (data: Omit<Intervention, 'id' | 'date' | 'lastUpdated' | 'summary' | 'status'>) => Promise<void>;
  updateIntervention: (id: string, updatedData: Partial<Intervention>) => Promise<void>;
  updateInterventionStatus: (id: string, status: Status) => Promise<void>;
  deleteIntervention: (id: string) => Promise<void>;
  setCreatingIntervention: (isCreating: boolean) => void;
  setEditingIntervention: (intervention: Intervention | null) => void;
  setDeletingIntervention: (intervention: Intervention | null) => void;

  createUser: (data: Omit<User, 'id' | 'avatar'>) => Promise<void>;
  updateUser: (id: string, updatedData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  setCreatingUser: (isCreating: boolean) => void;
  setEditingUser: (user: User | null) => void;
  setDeletingUser: (user: User | null) => void;
  
  isPending: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardLayoutClient({ 
    children, 
    initialInterventions,
    initialUsers
}: { 
    children: React.ReactNode,
    initialInterventions: Intervention[],
    initialUsers: User[]
}) {
  const { user, isAuthenticating, setAvailableUsers } = useUser();
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const [isCreatingIntervention, setCreatingIntervention] = useState(false);
  const [editingIntervention, setEditingIntervention] = useState<Intervention | null>(null);
  const [deletingIntervention, setDeletingIntervention] = useState<Intervention | null>(null);

  const [isCreatingUser, setCreatingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  
  useEffect(() => {
    if (!isAuthenticating && !user) {
      router.push('/login');
    }
  }, [user, isAuthenticating, router]);

  useEffect(() => {
    setAvailableUsers(initialUsers);
  }, [initialUsers, setAvailableUsers]);

  const technicians = useMemo(() => initialUsers.filter(u => u.role === 'Technicien'), [initialUsers]);

  // Interventions
  const createIntervention = async (data: Omit<Intervention, 'id' | 'date' | 'lastUpdated' | 'summary' | 'status'>) => {
    startTransition(async () => {
      try {
        await createInterventionAction(data);
        toast({
          title: 'Intervention créée',
          description: `La nouvelle intervention a été ajoutée.`,
        });
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de créer l\'intervention.',
          variant: 'destructive',
        });
      }
    });
  };

  const updateIntervention = async (id: string, updatedData: Partial<Intervention>) => {
    startTransition(async () => {
      try {
        await updateInterventionAction(id, updatedData);
        toast({
          title: 'Intervention mise à jour',
          description: `L'intervention ${id} a été mise à jour.`,
        });
      } catch (error) {
        toast({
          title: 'Erreur',
          description: "Impossible de mettre à jour l'intervention.",
          variant: 'destructive',
        });
      }
    });
  };
  
  const updateInterventionStatus = async (id: string, status: Status) => {
    await updateIntervention(id, { status });
  };

  const deleteIntervention = async (id: string) => {
    startTransition(async () => {
      try {
        await deleteInterventionAction(id);
        if (pathname === `/dashboard/interventions/${id}`) {
          router.push('/dashboard/interventions');
        }
        toast({
          title: 'Intervention supprimée',
          description: `L'intervention ${id} a été supprimée.`,
          variant: 'destructive',
        });
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de supprimer l\'intervention.',
          variant: 'destructive',
        });
      }
    });
  };
  
  // Users
  const createUser = async (data: Omit<User, 'id' | 'avatar'>) => {
    startTransition(async () => {
      try {
        await createUserAction({
            ...data,
            avatar: `https://picsum.photos/seed/user-${Math.random().toString(36).substr(2, 5)}/100`,
        });
        toast({
          title: 'Utilisateur créé',
          description: `Le compte pour ${data.name} a été ajouté.`,
        });
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de créer l\'utilisateur.',
          variant: 'destructive',
        });
      }
    });
  };

  const updateUser = async (id: string, data: Partial<User>) => {
    startTransition(async () => {
      try {
        await updateUserAction(id, data);
        toast({
          title: 'Utilisateur mis à jour',
          description: `Les informations de ${data.name} ont été modifiées.`,
        });
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de mettre à jour l\'utilisateur.',
          variant: 'destructive',
        });
      }
    });
  };

  const deleteUser = async (id: string) => {
    startTransition(async () => {
      try {
        await deleteUserAction(id);
        toast({
          title: 'Utilisateur supprimé',
          description: 'Le compte a été supprimé avec succès.',
          variant: 'destructive',
        });
      } catch (error) {
         toast({
          title: 'Erreur',
          description: 'Impossible de supprimer l\'utilisateur.',
          variant: 'destructive',
        });
      }
    });
  };

  const contextValue = useMemo(() => ({
    interventions: initialInterventions,
    users: initialUsers,
    createIntervention,
    updateIntervention,
    updateInterventionStatus,
    deleteIntervention,
    setCreatingIntervention,
    setEditingIntervention,
    setDeletingIntervention,
    createUser,
    updateUser,
    deleteUser,
    setCreatingUser,
    setEditingUser,
    setDeletingUser,
    isPending,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [initialInterventions, initialUsers, isPending]);
  
  if (isAuthenticating || !user) {
    return null; // Or a global loader
  }


  return (
    <DashboardContext.Provider value={contextValue}>
      <SidebarProvider>
        <Sidebar>
          <SidebarNav />
        </Sidebar>
        <SidebarInset>
          <div className="flex flex-col h-full">
            <DashboardHeader />
            <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
      
      <CreateInterventionDialog 
        isOpen={isCreatingIntervention}
        setIsOpen={setCreatingIntervention}
        onCreate={createIntervention}
        technicians={technicians}
        isPending={isPending}
      />

      <EditInterventionDialog
        intervention={editingIntervention}
        setIntervention={setEditingIntervention}
        onUpdate={updateIntervention}
        technicians={technicians}
        isPending={isPending}
      />
      
      <DeleteInterventionDialog
        intervention={deletingIntervention}
        setIntervention={setDeletingIntervention}
        onDelete={deleteIntervention}
        isPending={isPending}
      />

       <CreateUserDialog 
        isOpen={isCreatingUser}
        setIsOpen={setCreatingUser}
        onCreate={createUser}
        isPending={isPending}
      />

      <EditUserDialog
        user={editingUser}
        setUser={setEditingUser}
        onUpdate={updateUser}
        isPending={isPending}
      />
      
      <DeleteUserDialog
        user={deletingUser}
        setUser={setDeletingUser}
        onDelete={deleteUser}
        isPending={isPending}
      />

    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardLayoutClient provider');
  }
  return context;
}

    
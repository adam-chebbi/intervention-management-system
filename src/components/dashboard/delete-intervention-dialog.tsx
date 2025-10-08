'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Intervention } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface DeleteInterventionDialogProps {
  intervention: Intervention | null;
  setIntervention: (intervention: Intervention | null) => void;
  onDelete: (interventionId: string) => Promise<void>;
  isPending: boolean;
}

export function DeleteInterventionDialog({ intervention, setIntervention, onDelete, isPending }: DeleteInterventionDialogProps) {

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIntervention(null);
    }
  };

  const handleDelete = async () => {
    if (!intervention) return;
    await onDelete(intervention.id);
    setIntervention(null);
  };

  return (
    <AlertDialog open={!!intervention} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette intervention ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. L'intervention <span className='font-bold'>{intervention?.id}</span> pour le client <span className='font-bold'>{intervention?.clientName}</span> sera définitivement supprimée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmer la suppression
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

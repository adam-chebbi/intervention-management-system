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
import type { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface DeleteUserDialogProps {
  user: User | null;
  setUser: (user: User | null) => void;
  onDelete: (userId: string) => Promise<void>;
  isPending: boolean;
}

export function DeleteUserDialog({ user, setUser, onDelete, isPending }: DeleteUserDialogProps) {
  const { toast } = useToast();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setUser(null);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    await onDelete(user.id);
    toast({
      title: 'Utilisateur supprimé',
      description: `Le compte de ${user.name} a été supprimé avec succès.`,
      variant: 'destructive'
    });
    setUser(null);
  };

  return (
    <AlertDialog open={!!user} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Le compte de <span className='font-bold'>{user?.name}</span> ({user?.email}) sera définitivement supprimé.
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

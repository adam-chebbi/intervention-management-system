'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { User, Role } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface EditUserDialogProps {
  user: User | null;
  setUser: (user: User | null) => void;
  onUpdate: (id: string, data: Partial<User>) => Promise<void>;
  isPending: boolean;
}

const roles: Role[] = ['Administrateur', 'Technicien', 'Agent de support'];

const UserSchema = z.object({
  name: z.string().min(2, { message: 'Le nom est requis.' }),
  email: z.string().email({ message: 'Veuillez entrer un email valide.' }),
  role: z.string({ required_error: 'Veuillez choisir un rôle.' }),
  password: z.string().optional(),
});

type UserFormData = z.infer<typeof UserSchema>;

export function EditUserDialog({ user, setUser, onUpdate, isPending }: EditUserDialogProps) {
  const { toast } = useToast();
  const form = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
      });
    } else {
        form.reset();
    }
  }, [user, form]);
  
  const handleOpenChange = (open: boolean) => {
    if(!open) {
        setUser(null);
    }
  }

  const onSubmit = async (data: UserFormData) => {
    if (!user) return;

    const updatedData: Partial<User> = {
      name: data.name,
      email: data.email,
      role: data.role as Role,
      ...(data.password && { password: data.password }),
    };

    await onUpdate(user.id, updatedData);
    handleOpenChange(false)
    toast({
      title: 'Utilisateur mis à jour',
      description: `Les informations de ${user.name} ont été modifiées.`,
    });
  };

  return (
    <Dialog open={!!user} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur: {user?.name}</DialogTitle>
          <DialogDescription>
            Mettez à jour les informations du compte. Laissez le mot de passe vide pour ne pas le changer.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email professionnel</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rôle</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un rôle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau mot de passe (Optionnel)</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)} disabled={isPending}>Annuler</Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { User, Intervention, Category, Priority, Region, Status } from '@/lib/types';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface EditInterventionDialogProps {
  intervention: Intervention | null;
  setIntervention: (intervention: Intervention | null) => void;
  onUpdate: (id: string, data: Partial<Intervention>) => Promise<void>;
  technicians: User[];
  isPending: boolean;
}

const categories: Category[] = ['Pannes', 'Branchements', 'Relevés', 'Maintenance', 'Autre'];
const priorities: Priority[] = ['Normale', 'Urgente'];
const regions: Region[] = ['Tunis', 'Sfax', 'Sousse', 'Ariana', 'Ben Arous', 'Nabeul'];
const statuses: Status[] = ['En attente', 'En cours', 'Clôturée'];

const InterventionSchema = z.object({
  clientName: z.string().min(2, { message: 'Le nom du client est requis.' }),
  address: z.string().min(5, { message: "L'adresse est requise." }),
  region: z.string({ required_error: 'Veuillez choisir une région.' }),
  notes: z.string().min(10, { message: 'Veuillez fournir des notes détaillées (min. 10 caractères).' }),
  assignedTo: z.string().optional(),
  category: z.string({ required_error: 'Veuillez choisir une catégorie.' }),
  priority: z.string({ required_error: 'Veuillez définir une priorité.' }),
  status: z.string({ required_error: 'Veuillez définir un statut.' }),
});

type InterventionFormData = z.infer<typeof InterventionSchema>;

export function EditInterventionDialog({ intervention, setIntervention, technicians, onUpdate, isPending }: EditInterventionDialogProps) {
  const form = useForm<InterventionFormData>({
    resolver: zodResolver(InterventionSchema),
  });

  useEffect(() => {
    if (intervention) {
      form.reset({
        clientName: intervention.clientName,
        address: intervention.address,
        region: intervention.region,
        notes: intervention.notes,
        assignedTo: intervention.assignedTo || '',
        category: intervention.category,
        priority: intervention.priority,
        status: intervention.status,
      });
    } else {
        form.reset();
    }
  }, [intervention, form]);
  
  const handleOpenChange = (open: boolean) => {
    if(!open) {
        setIntervention(null);
    }
  }

  const onSubmit = async (data: InterventionFormData) => {
    if (!intervention) return;

    const updatedData: Partial<Intervention> = {
      ...data,
      assignedTo: data.assignedTo || '',
    };

    await onUpdate(intervention.id, updatedData);
    handleOpenChange(false)
  };

  return (
    <Dialog open={!!intervention} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier l'intervention: {intervention?.id}</DialogTitle>
          <DialogDescription>
            Mettez à jour les détails de l'intervention ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du client</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: M. Jean Dupont" {...field} disabled={isPending}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 123 Rue de la Liberté, Tunis" {...field} disabled={isPending}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes d'intervention</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez en détail le problème ou la demande..."
                      className="min-h-[120px]"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Région</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir une région" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Définir un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statuses.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
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
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priorité</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Définir une priorité" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorities.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigner à (Optionnel)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''} disabled={isPending}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un technicien" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value=" ">Non assigné</SelectItem>
                      {technicians.map((tech) => (
                        <SelectItem key={tech.id} value={tech.id}>
                          {tech.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

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
import type { User, Intervention, Category, Priority, Region } from '@/lib/types';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface CreateInterventionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onCreate: (intervention: Omit<Intervention, 'id' | 'date' | 'lastUpdated' | 'summary' | 'status'>) => Promise<void>;
  technicians: User[];
  isPending: boolean;
}

const categories: Category[] = ['Pannes', 'Branchements', 'Relevés', 'Maintenance', 'Autre'];
const priorities: Priority[] = ['Normale', 'Urgente'];
const regions: Region[] = ['Tunis', 'Sfax', 'Sousse', 'Ariana', 'Ben Arous', 'Nabeul'];

const InterventionSchema = z.object({
  clientName: z.string().min(2, { message: 'Le nom du client est requis.' }),
  address: z.string().min(5, { message: "L'adresse est requise." }),
  region: z.string({ required_error: 'Veuillez choisir une région.' }),
  notes: z.string().min(10, { message: 'Veuillez fournir des notes détaillées (min. 10 caractères).' }),
  assignedTo: z.string().optional(),
  category: z.string({ required_error: 'Veuillez choisir une catégorie.' }),
  priority: z.string({ required_error: 'Veuillez définir une priorité.' }),
});

type InterventionFormData = z.infer<typeof InterventionSchema>;

export function CreateInterventionDialog({ isOpen, setIsOpen, technicians, onCreate, isPending }: CreateInterventionDialogProps) {
  const form = useForm<InterventionFormData>({
    resolver: zodResolver(InterventionSchema),
    defaultValues: {
      clientName: '',
      address: '',
      region: '',
      notes: '',
      assignedTo: '',
      category: '',
      priority: 'Normale',
    },
  });
  
  useEffect(() => {
    if (!isOpen) {
        form.reset();
    }
  }, [isOpen, form]);

  const onSubmit = async (data: InterventionFormData) => {
    const interventionData = {
        ...data,
        region: data.region as Region,
        category: data.category as Category,
        priority: data.priority as Priority,
        assignedTo: data.assignedTo || '',
    };
    await onCreate(interventionData);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle intervention</DialogTitle>
          <DialogDescription>
            Remplissez les détails ci-dessous pour créer une intervention.
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
                      <Input placeholder="Ex: M. Jean Dupont" {...field} disabled={isPending} />
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
                      <Input placeholder="Ex: 123 Rue de la Liberté, Tunis" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Région</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
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
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isPending}>Annuler</Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Créer l'intervention
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

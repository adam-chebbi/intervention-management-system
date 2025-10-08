
'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { Region, Category, Priority } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Building, User, Loader2 } from 'lucide-react';
import { AddressTunisiaInput } from '@/components/address-tunisia-input';
import { createInterventionAction } from '@/actions/intervention-actions';


const regions: Region[] = ['Tunis', 'Sfax', 'Sousse', 'Ariana', 'Ben Arous', 'Nabeul'];
const interventionTypes: Category[] = ['Pannes', 'Branchements', 'Relevés', 'Maintenance', 'Autre'];

const ReportSchemaClient = z.object({
  fullName: z.string().min(2, { message: 'Le nom est requis.' }),
  customerNumber: z.string().optional(),
  governorate: z.string({ required_error: 'Veuillez sélectionner un gouvernorat.' }),
  delegation: z.string({ required_error: 'Veuillez sélectionner une délégation.' }),
  postalCode: z.string(),
  streetLine: z.string().min(5, { message: "Veuillez fournir un numéro et nom de rue."}),
  phone: z.string().min(8, { message: 'Veuillez fournir un numéro de téléphone valide.'}),
  email: z.string().email({ message: 'Veuillez entrer un email valide.' }),
  interventionType: z.string({ required_error: 'Veuillez sélectionner un type d\'intervention.'}),
  description: z.string().min(10, { message: 'Le message doit contenir au moins 10 caractères.' }),
  isUrgent: z.boolean().default(false),
});

const ReportSchemaEntreprise = z.object({
  companyName: z.string().min(2, { message: 'Le nom de l\'entreprise est requis.' }),
  contractNumber: z.string().optional(),
  address: z.string().min(10, { message: 'Veuillez fournir une adresse complète.' }),
  region: z.string({ required_error: 'Veuillez sélectionner une région.'}),
  contactPerson: z.string().min(2, { message: 'Le nom du contact est requis.' }),
  phone: z.string().min(8, { message: 'Veuillez fournir un numéro de téléphone valide.'}),
  email: z.string().email({ message: 'Veuillez entrer un email valide.' }),
  interventionType: z.string({ required_error: 'Veuillez sélectionner un type d\'intervention.'}),
  description: z.string().min(10, { message: 'Le message doit contenir au moins 10 caractères.' }),
  isUrgent: z.boolean().default(false),
});

type FormType = 'client' | 'entreprise';

export default function ReportPage() {
  const { toast } = useToast();
  const [formType, setFormType] = useState<FormType>('client');
  const [isPending, startTransition] = useTransition();

  const formClient = useForm<z.infer<typeof ReportSchemaClient>>({
    resolver: zodResolver(ReportSchemaClient),
    defaultValues: {
      fullName: '',
      customerNumber: '',
      governorate: '',
      delegation: '',
      postalCode: '',
      streetLine: '',
      phone: '',
      email: '',
      description: '',
      isUrgent: false,
    },
  });

  const formEntreprise = useForm<z.infer<typeof ReportSchemaEntreprise>>({
    resolver: zodResolver(ReportSchemaEntreprise),
    defaultValues: {
      companyName: '',
      contractNumber: '',
      address: '',
      region: '',
      contactPerson: '',
      phone: '',
      email: '',
      description: '',
      isUrgent: false,
    },
  });

  const onSubmitClient = (values: z.infer<typeof ReportSchemaClient>) => {
    startTransition(async () => {
      try {
        const fullAddress = `${values.streetLine}, ${values.delegation}, ${values.governorate}, ${values.postalCode}`;
        
        let notes = `Signalement de la part d'un client particulier.
Email: ${values.email}
Téléphone: ${values.phone}
Numéro Client: ${values.customerNumber || 'Non fourni'}
------------------------------------
Description du client:
${values.description}`;

        if (values.isUrgent) {
            notes = `**URGENCE SIGNALÉE PAR LE CLIENT**\n${notes}`;
        }
        
        await createInterventionAction({
          clientName: values.fullName,
          address: fullAddress,
          region: values.governorate as Region,
          category: values.interventionType as Category,
          priority: 'Normale', // La priorité est définie par les agents, pas le public
          notes: notes,
          assignedTo: '',
        });

        toast({
          title: 'Demande soumise',
          description: 'Nous avons bien reçu votre signalement. Un agent vous contactera bientôt.',
        });
        formClient.reset();

      } catch (error) {
         toast({
          title: 'Erreur',
          description: 'Impossible de soumettre votre demande. Veuillez réessayer.',
          variant: 'destructive',
        });
      }
    });
  };

  const onSubmitEntreprise = (values: z.infer<typeof ReportSchemaEntreprise>) => {
     startTransition(async () => {
      try {
        let notes = `Signalement de la part d'une entreprise.
Contact: ${values.contactPerson}
Email: ${values.email}
Téléphone: ${values.phone}
Numéro Contrat: ${values.contractNumber || 'Non fourni'}
------------------------------------
Description du client:
${values.description}`;

        if (values.isUrgent) {
            notes = `**URGENCE SIGNALÉE PAR LE CLIENT**\n${notes}`;
        }

        await createInterventionAction({
          clientName: values.companyName,
          address: values.address,
          region: values.region as Region,
          category: values.interventionType as Category,
          priority: 'Normale',
          notes: notes,
          assignedTo: '',
        });

        toast({
          title: 'Demande soumise',
          description: 'Nous avons bien reçu votre signalement. Un agent vous contactera bientôt.',
        });
        formEntreprise.reset();

      } catch (error) {
         toast({
          title: 'Erreur',
          description: 'Impossible de soumettre votre demande. Veuillez réessayer.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
       <PublicHeader />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="text-3xl">Signaler une intervention</CardTitle>
            <CardDescription>
              Remplissez ce formulaire pour nous signaler un problème ou une demande. Un numéro de suivi vous sera envoyé.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Button variant={formType === 'client' ? 'default' : 'outline'} onClick={() => setFormType('client')}>
                    <User className="mr-2 h-4 w-4" />
                    Client Particulier
                </Button>
                <Button variant={formType === 'entreprise' ? 'default' : 'outline'} onClick={() => setFormType('entreprise')}>
                    <Building className="mr-2 h-4 w-4" />
                    Entreprise
                </Button>
            </div>
            
            {formType === 'client' && (
                <Form {...formClient}>
                <form onSubmit={formClient.handleSubmit(onSubmitClient)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={formClient.control}
                        name="fullName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom complet</FormLabel>
                            <FormControl>
                            <Input placeholder="Votre nom et prénom" {...field} disabled={isPending}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={formClient.control}
                        name="customerNumber"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Numéro client <span className="text-muted-foreground">(Optionnel)</span></FormLabel>
                            <FormControl>
                            <Input placeholder="Votre numéro de client" {...field} disabled={isPending}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                    
                    <AddressTunisiaInput form={formClient} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={formClient.control}
                        name="phone"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Téléphone</FormLabel>
                            <FormControl>
                            <Input placeholder="Votre numéro de téléphone" {...field} disabled={isPending}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={formClient.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                            <Input placeholder="votre.email@exemple.com" type="email" {...field} disabled={isPending}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                    <FormField
                        control={formClient.control}
                        name="interventionType"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Type d'intervention</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner le type de demande" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {interventionTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                    {type}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                    control={formClient.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Description de la demande</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Veuillez décrire le problème ou votre demande le plus précisément possible..." className="min-h-[150px]" {...field} disabled={isPending}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                        control={formClient.control}
                        name="isUrgent"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                            <FormControl>
                                <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isPending}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                Cocher cette case s'il s'agit d'une urgence
                                </FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Par ex: fuite de gaz, câble électrique tombé à terre, etc.
                                </p>
                            </div>
                            </FormItem>
                        )}
                        />
                    <Button type="submit" className="w-full" disabled={isPending}>
                         {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Soumettre la demande
                    </Button>
                </form>
                </Form>
            )}

            {formType === 'entreprise' && (
                <Form {...formEntreprise}>
                    <form onSubmit={formEntreprise.handleSubmit(onSubmitEntreprise)} className="space-y-6">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={formEntreprise.control}
                                name="companyName"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Raison Sociale</FormLabel>
                                    <FormControl>
                                    <Input placeholder="Nom de votre entreprise" {...field} disabled={isPending}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={formEntreprise.control}
                                name="contractNumber"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Numéro de contrat <span className="text-muted-foreground">(Optionnel)</span></FormLabel>
                                    <FormControl>
                                    <Input placeholder="Votre numéro de contrat" {...field} disabled={isPending}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={formEntreprise.control}
                                name="address"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Adresse du site</FormLabel>
                                    <FormControl>
                                    <Input placeholder="Ex: Zone industrielle, Ben Arous" {...field} disabled={isPending}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={formEntreprise.control}
                                name="region"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Gouvernorat</FormLabel>
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
                        </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <FormField
                                control={formEntreprise.control}
                                name="contactPerson"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Personne de contact</FormLabel>
                                    <FormControl>
                                    <Input placeholder="Nom et fonction du contact" {...field} disabled={isPending}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={formEntreprise.control}
                                name="phone"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Téléphone professionnel</FormLabel>
                                    <FormControl>
                                    <Input placeholder="Numéro de téléphone" {...field} disabled={isPending}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                         <FormField
                                control={formEntreprise.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email professionnel</FormLabel>
                                    <FormControl>
                                    <Input placeholder="contact@entreprise.com" type="email" {...field} disabled={isPending}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        <FormField
                            control={formEntreprise.control}
                            name="interventionType"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Type d'intervention</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner le type de demande" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {interventionTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                        {type}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <FormField
                        control={formEntreprise.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Description de la demande</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Veuillez décrire le problème ou votre demande le plus précisément possible..." className="min-h-[150px]" {...field} disabled={isPending}/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                            control={formEntreprise.control}
                            name="isUrgent"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                <FormControl>
                                    <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isPending}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                    Cocher cette case s'il s'agit d'une urgence
                                    </FormLabel>
                                    <p className="text-sm text-muted-foreground">
                                        Par ex: fuite de gaz, câble électrique tombé à terre, etc.
                                    </p>
                                </div>
                                </FormItem>
                            )}
                            />
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Soumettre la demande
                        </Button>
                    </form>
                </Form>
            )}
            
          </CardContent>
        </Card>
      </main>
      <PublicFooter />
    </div>
  );
}

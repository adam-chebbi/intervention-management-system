'use client';

import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Loader2 } from 'lucide-react';

interface Governorate {
  Name: string;
  Value: string;
  Delegations: Delegation[];
}

interface Delegation {
  Name: string;
  Value: string;
  PostalCode: string;
}

interface AddressTunisiaInputProps {
  form: UseFormReturn<any>;
}

export function AddressTunisiaInput({ form }: AddressTunisiaInputProps) {
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedGovernorateValue = form.watch('governorate');

  useEffect(() => {
    const fetchGovernorates = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/municipalities');
        if (!response.ok) {
          throw new Error('Failed to fetch governorates');
        }
        const data = await response.json();
        // Sort alphabetically by name
        const sortedData = data.sort((a: Governorate, b: Governorate) => a.Name.localeCompare(b.Name));
        setGovernorates(sortedData);
      } catch (e) {
        setError('Le service de récupération des adresses est momentanément indisponible. Veuillez réessayer plus tard.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchGovernorates();
  }, []);

  useEffect(() => {
    if (selectedGovernorateValue) {
      const selectedGov = governorates.find(g => g.Value === selectedGovernorateValue);
      if (selectedGov) {
        // Sort alphabetically by name
        const sortedDelegations = selectedGov.Delegations.sort((a,b) => a.Name.localeCompare(b.Name));
        setDelegations(sortedDelegations);
        form.resetField('delegation', { defaultValue: '' });
        form.resetField('postalCode', { defaultValue: '' });
      }
    } else {
      setDelegations([]);
      form.resetField('delegation', { defaultValue: '' });
      form.resetField('postalCode', { defaultValue: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGovernorateValue, governorates]);

  const handleDelegationChange = (delegationValue: string) => {
    const selectedDel = delegations.find(d => `${d.Value}-${d.PostalCode}` === delegationValue);
    if (selectedDel) {
        form.setValue('delegation', selectedDel.Name, { shouldValidate: true });
        form.setValue('postalCode', selectedDel.PostalCode, { shouldValidate: true });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-4 border rounded-md text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p>Chargement des adresses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="governorate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gouvernorat</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un gouvernorat" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {governorates.map((gov) => (
                    <SelectItem key={gov.Value} value={gov.Value}>
                      {gov.Name}
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
          name="delegation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Délégation</FormLabel>
              <Select
                onValueChange={(value) => {
                  handleDelegationChange(value);
                  field.onChange(form.getValues('delegation'));
                }}
                value={field.value ? `${form.getValues('delegation')}-${form.getValues('postalCode')}` : ''}
                disabled={!selectedGovernorateValue || delegations.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une délégation" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {delegations.map((del, index) => (
                    <SelectItem key={`${del.Value}-${del.PostalCode}-${index}`} value={`${del.Value}-${del.PostalCode}`}>
                      {del.Name}
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
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code Postal</FormLabel>
              <FormControl>
                <Input placeholder="Code postal" {...field} readOnly />
              </FormControl>
               <FormDescription>
                Déduit automatiquement de la délégation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="streetLine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>N° et Rue</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 12 Rue de la Liberté" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

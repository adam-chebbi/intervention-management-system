'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

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
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/user-context';
import { verifyUserPasswordAction, getUsersAction } from '@/actions/user-actions';

const LoginSchema = z.object({
  email: z.string().email({ message: 'Veuillez entrer un email valide.' }),
  password: z.string().min(1, { message: 'Le mot de passe est requis.' }),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { setUser, setAvailableUsers } = useUser();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(async () => {
      try {
        const authenticatedUser = await verifyUserPasswordAction(values.email, values.password);
        
        if (authenticatedUser) {
          const allUsers = await getUsersAction();
          setAvailableUsers(allUsers);
          setUser(authenticatedUser);
          toast({
            title: 'Connexion réussie',
            description: 'Redirection vers le tableau de bord...',
          });
          router.push('/dashboard');
        } else {
          toast({
            variant: 'destructive',
            title: 'Erreur d\'authentification',
            description: 'Email ou mot de passe incorrect.',
          });
        }
      } catch (error) {
         toast({
            variant: 'destructive',
            title: 'Erreur de connexion',
            description: 'Un problème est survenu. Veuillez réessayer.',
          });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email professionnel</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="nom.prenom@mail.com.tn" type="email" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="••••••••" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Se connecter
        </Button>
      </form>
    </Form>
  );
}

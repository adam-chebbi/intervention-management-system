'use client';

import * as React from 'react';
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Search,
  Wrench,
  Building,
} from 'lucide-react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { useDashboard } from '@/app/dashboard/layout.client';
import { useRouter } from 'next/navigation';
import { useHotkeys } from '@/hooks/use-hotkeys';

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const { interventions, users } = useDashboard();
  const router = useRouter();

  useHotkeys([
    ['k', () => setOpen((open) => !open), { metaKey: true }],
  ]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const interventionResults = interventions.map((intervention) => ({
    id: `int-${intervention.id}`,
    label: `${intervention.id}: ${intervention.clientName}`,
    onSelect: () => runCommand(() => router.push(`/dashboard/interventions/${intervention.id}`)),
    icon: Wrench,
  }));

  const clientResults = [
    ...new Map(interventions.map((item) => [item.clientName, item])).values(),
  ].map((intervention) => ({
    id: `client-${intervention.clientName}`,
    label: intervention.clientName,
    onSelect: () => runCommand(() => router.push(`/dashboard/interventions/${intervention.id}`)), // Or a future client page
    icon: Building,
  }));

  const userResults = users.map((user) => ({
    id: `user-${user.id}`,
    label: `${user.name} (${user.role})`,
    onSelect: () => runCommand(() => router.push('/dashboard/users')),
    icon: User,
  }));


  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-muted-foreground flex items-center gap-2 p-2 rounded-md border border-input w-full max-w-sm hover:bg-accent"
      >
        <Search className="h-4 w-4" />
        <span>Rechercher...</span>
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Tapez une commande ou recherchez..." />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          <CommandGroup heading="Interventions">
            {interventionResults.map((result) => (
              <CommandItem key={result.id} onSelect={result.onSelect}>
                <result.icon className="mr-2 h-4 w-4" />
                <span>{result.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
           <CommandSeparator />
          <CommandGroup heading="Clients">
            {clientResults.map((result) => (
              <CommandItem key={result.id} onSelect={result.onSelect}>
                <result.icon className="mr-2 h-4 w-4" />
                <span>{result.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
           <CommandSeparator />
          <CommandGroup heading="Utilisateurs">
             {userResults.map((result) => (
              <CommandItem key={result.id} onSelect={result.onSelect}>
                <result.icon className="mr-2 h-4 w-4" />
                <span>{result.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

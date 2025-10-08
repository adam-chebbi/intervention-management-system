'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useUser } from '@/contexts/user-context';
import { Users, Settings, User as UserIcon, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GlobalSearch } from './global-search';
import { Notifications } from './notifications';

export function DashboardHeader() {
  const { user, setUser, availableUsers } = useUser();
  const router = useRouter();

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return names[0]?.substring(0, 2) ?? '';
  };

  const handleLogout = () => {
    setUser(null);
    router.push('/login');
  };

  const handleUserSwitch = (id: string) => {
    const newUser = availableUsers.find(u => u.id === id);
    if (newUser) {
      setUser(newUser);
    }
  }

  if (!user) {
    return (
       <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
       </header>
    )
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        <GlobalSearch />
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Notifications />
        {user.role === 'Administrateur' && (
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Simuler: {user.role}</span>
                <span className="sm:hidden">Admin</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Changer de rôle</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={user.id} onValueChange={handleUserSwitch}>
                {availableUsers.map((u) => (
                    <DropdownMenuRadioItem key={u.id} value={u.id}>
                        {u.name} ({u.role})
                    </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profil</span>
            </DropdownMenuItem>
             <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                 <LogOut className="mr-2 h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, UserPlus, Pencil, Trash2 } from 'lucide-react';
import type { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useDashboard } from '../layout.client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';


export default function UsersPage() {
  const { users, setCreatingUser, setEditingUser, setDeletingUser } = useDashboard();

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };

  const roleColors: Record<User['role'], string> = {
    'Administrateur': 'bg-primary/20 text-primary-foreground border-primary/30',
    'Technicien': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'Agent de support': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Gestion des utilisateurs</h2>
            <p className="text-muted-foreground">
            Gérez les comptes des employés, les rôles et les permissions.
            </p>
        </div>
        <Button onClick={() => setCreatingUser(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des employés</CardTitle>
          <CardDescription>
            Liste de tous les comptes enregistrés sur la plateforme.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead className="hidden sm:table-cell">Rôle</TableHead>
                  <TableHead className="hidden md:table-cell">Statut</TableHead>
                  <TableHead className="hidden lg:table-cell">Date de création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className={cn(roleColors[user.role])}>{user.role}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                        Actif
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {new Date().toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Ouvrir le menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setEditingUser(user)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => setDeletingUser(user)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

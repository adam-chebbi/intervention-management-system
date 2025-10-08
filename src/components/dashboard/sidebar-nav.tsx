'use client';

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Wrench, Users, History, BarChart2, LogOut } from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/assets/logo-32x32.png';


const menuItems = {
  all: [
    { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/dashboard/interventions', label: 'Interventions', icon: Wrench },
    { href: '/dashboard/statistiques', label: 'Statistiques', icon: BarChart2 },
    { href: '/dashboard/historique', label: 'Historique', icon: History },
  ],
  'Agent de support': [
  ],
  Technicien: [
  ],
  Administrateur: [
    { href: '/dashboard/users', label: 'Utilisateurs', icon: Users },
  ],
};

export function SidebarNav() {
  const { user, setUser } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    router.push('/login');
  };

  const getMenuItemsForRole = () => {
    if (!user) return [];
    const roleSpecificItems = menuItems[user.role] || [];
    const baseItems = menuItems.all;
    
    const combined = [...baseItems, ...roleSpecificItems];
    const uniqueItems = Array.from(new Map(combined.map(item => [item.href, item])).values());
    
    if (user.role === 'Technicien') {
      return uniqueItems.filter(item => item.href === '/dashboard' || item.href === '/dashboard/interventions');
    }
    
    return uniqueItems;
  };

  const visibleMenuItems = getMenuItemsForRole();

  if (!user) return null;

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Image src={Logo} alt="Logo" width={32} height={32} />
            <span className="text-lg font-semibold">Manager Dashboard</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {visibleMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  as="a"
                  isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
             <SidebarMenuButton onClick={handleLogout}>
                <LogOut />
                <span>Déconnexion</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </>
  );
}

'use client';

import type { User } from '@/lib/types';
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { getUserByIdAction } from '@/actions/user-actions';
import { useRouter, usePathname } from 'next/navigation';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  availableUsers: User[];
  setAvailableUsers: (users: User[]) => void;
  isAuthenticating: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const PROTECTED_ROUTES_PREFIX = '/dashboard';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const storedUserId = localStorage.getItem('steg-user-id');
        if (storedUserId) {
          const activeUser = await getUserByIdAction(storedUserId);
          setCurrentUser(activeUser || null);
          if (!activeUser && pathname.startsWith(PROTECTED_ROUTES_PREFIX)) {
            router.push('/login');
          }
        } else if (pathname.startsWith(PROTECTED_ROUTES_PREFIX)) {
          router.push('/login');
        }
      } catch (error) {
        console.error("Failed to initialize user context:", error);
        setCurrentUser(null);
        if (pathname.startsWith(PROTECTED_ROUTES_PREFIX)) {
          router.push('/login');
        }
      } finally {
        setIsAuthenticating(false);
      }
    };
    
    initializeUser();
  }, [pathname, router]);

  const handleSetUser = (user: User | null) => {
    setCurrentUser(user);
    try {
      if (user) {
        localStorage.setItem('steg-user-id', user.id);
      } else {
        localStorage.removeItem('steg-user-id');
      }
    } catch (error) {
      console.error("Could not access localStorage. User session will not be persisted.");
    }
  };
  
  const contextValue = useMemo(() => ({
    user: currentUser,
    setUser: handleSetUser,
    availableUsers,
    setAvailableUsers,
    isAuthenticating,
  }), [currentUser, availableUsers, isAuthenticating]);

  if (isAuthenticating && pathname.startsWith(PROTECTED_ROUTES_PREFIX)) {
    return null; 
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

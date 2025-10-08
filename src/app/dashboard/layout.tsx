import type { Metadata } from 'next';
import { DashboardLayoutClient } from './layout.client';
import { getInterventionsAction } from '@/actions/intervention-actions';
import { getUsersAction } from '@/actions/user-actions';


export const metadata: Metadata = {
  title: 'Tableau de bord - Manager',
  description: 'Gestion des interventions.',
};

// Revalidate data every 15 seconds to check for notifications
export const revalidate = 15;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const interventions = await getInterventionsAction();
  const users = await getUsersAction();

  return (
      <DashboardLayoutClient initialInterventions={interventions} initialUsers={users}>
        {children}
      </DashboardLayoutClient>
  );
}

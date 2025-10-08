
'use server';

import { revalidatePath } from 'next/cache';
import { interventionService } from '@/services/intervention-service';
import type { Intervention, Status } from '@/lib/types';

type CreateInterventionData = Omit<Intervention, 'id' | 'date' | 'lastUpdated'>;

export async function getInterventionsAction(): Promise<Intervention[]> {
  return await interventionService.getAll();
}

export async function getInterventionAction(id: string): Promise<Intervention | null> {
    return await interventionService.getById(id);
}

export async function createInterventionAction(data: CreateInterventionData): Promise<Intervention> {
  const newIntervention = await interventionService.create(data);
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/interventions');
  return newIntervention;
}

export async function updateInterventionAction(id: string, data: Partial<Intervention>): Promise<Intervention> {
  const updatedIntervention = await interventionService.update(id, data);
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/interventions');
  revalidatePath(`/dashboard/interventions/${id}`);
  return updatedIntervention;
}

export async function deleteInterventionAction(id: string): Promise<void> {
  await interventionService.delete(id);
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/interventions');
}

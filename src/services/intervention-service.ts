
import type { Intervention, Status } from '@/lib/types';

type CreateInterventionData = Omit<Intervention, 'id' | 'date' | 'lastUpdated'>;

class InterventionService {
  private get interventionsCollection() {
    // Deferred import to avoid build errors if env vars are not set
    const { db } = require('@/lib/firebase-admin');
    return db.collection('interventions');
  }

  async getAll(): Promise<Intervention[]> {
    const snapshot = await this.interventionsCollection.orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => this.mapDocToIntervention(doc));
  }
  
  async getById(id: string): Promise<Intervention | null> {
    const doc = await this.interventionsCollection.doc(id).get();
    if (!doc.exists) {
        return null;
    }
    return this.mapDocToIntervention(doc);
  }

  async create(data: CreateInterventionData): Promise<Intervention> {
    const now = new Date().toISOString();
    
    // Firestore generates the ID if we use .add()
    const docRef = await this.interventionsCollection.add({
      ...data,
      date: now,
      lastUpdated: now,
      status: 'En attente',
    });
    
    const newDoc = await docRef.get();
    return this.mapDocToIntervention(newDoc);
  }

  async update(id: string, data: Partial<Intervention>): Promise<Intervention> {
    const docRef = this.interventionsCollection.doc(id);
    
    const updateData = {
        ...data,
        lastUpdated: new Date().toISOString()
    };
    
    // Ensure assignedTo is handled correctly (not undefined)
    if (data.assignedTo === '' || data.assignedTo) {
        updateData.assignedTo = data.assignedTo;
    } else if ('assignedTo' in data && data.assignedTo === undefined) {
        updateData.assignedTo = '';
    }

    await docRef.update(updateData);
    
    const updatedDoc = await docRef.get();
    if (!updatedDoc.exists) {
      throw new Error(`Intervention with ID ${id} not found after update.`);
    }
    return this.mapDocToIntervention(updatedDoc);
  }

  async delete(id: string): Promise<void> {
    await this.interventionsCollection.doc(id).delete();
  }

  private mapDocToIntervention(doc: FirebaseFirestore.DocumentSnapshot): Intervention {
    const data = doc.data();
    if (!data) {
        throw new Error(`Document data is empty for doc ${doc.id}`);
    }
    return {
      id: doc.id,
      clientName: data.clientName || '',
      address: data.address || '',
      region: data.region || 'Autre',
      category: data.category || 'Autre',
      status: data.status || 'En attente',
      priority: data.priority || 'Normale',
      assignedTo: data.assignedTo || '',
      date: data.date || new Date().toISOString(),
      lastUpdated: data.lastUpdated || new Date().toISOString(),
      notes: data.notes || '',
      summary: data.summary || '',
    } as Intervention;
  }
}

export const interventionService = new InterventionService();

    
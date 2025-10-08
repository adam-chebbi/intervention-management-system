import type { User } from '@/lib/types';
import bcrypt from 'bcryptjs';

type CreateUserData = Omit<User, 'id'>;

class UserService {
  private get usersCollection() {
    const { db } = require('@/lib/firebase-admin');
    return db.collection('users');
  }

  async getAll(): Promise<User[]> {
    const snapshot = await this.usersCollection.orderBy('name').get();
    return snapshot.docs.map(doc => this.mapDocToUser(doc));
  }

  async getById(id: string): Promise<User | null> {
    const doc = await this.usersCollection.doc(id).get();
    if (!doc.exists) {
        return null;
    }
    return this.mapDocToUser(doc);
  }

  async getByEmail(email: string): Promise<(User & { password?: string }) | null> {
    const snapshot = await this.usersCollection.where('email', '==', email).limit(1).get();
    if (snapshot.empty) {
        return null;
    }
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
    } as User & { password?: string };
  }

  async create(data: CreateUserData): Promise<User> {
    const docRef = this.usersCollection.doc();
    
    const dataToCreate: any = { ...data, id: docRef.id };
    if (data.password) {
        dataToCreate.password = await bcrypt.hash(data.password, 10);
    }
    
    await docRef.set(dataToCreate);
    const newDoc = await docRef.get();
    return this.mapDocToUser(newDoc);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const docRef = this.usersCollection.doc(id);
    const dataToUpdate: Partial<User> = { ...data };

    if (data.password && data.password.length > 0) {
      dataToUpdate.password = await bcrypt.hash(data.password, 10);
    } else {
      delete dataToUpdate.password;
    }

    await docRef.update(dataToUpdate);
    const updatedDoc = await docRef.get();
    return this.mapDocToUser(updatedDoc);
  }

  async delete(id: string): Promise<void> {
    await this.usersCollection.doc(id).delete();
  }
  
  private mapDocToUser(doc: FirebaseFirestore.DocumentSnapshot): User {
    const data = doc.data();
    // Intentionally omit the password when returning user objects from the service
    const { password, ...userWithoutPassword } = data as User & { password?: string };
    return {
      id: doc.id,
      ...userWithoutPassword,
    } as User;
  }
}

export const userService = new UserService();

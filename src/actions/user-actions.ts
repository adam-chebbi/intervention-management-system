'use server';

import { revalidatePath } from 'next/cache';
import { userService } from '@/services/user-service';
import type { User } from '@/lib/types';
import bcrypt from 'bcryptjs';

type CreateUserData = Omit<User, 'id'>;

export async function getUsersAction(): Promise<User[]> {
  return await userService.getAll();
}

export async function getUserByIdAction(id: string): Promise<User | null> {
    return await userService.getById(id);
}

export async function createUserAction(data: CreateUserData): Promise<User> {
  const newUser = await userService.create(data);
  revalidatePath('/dashboard/users');
  return newUser;
}

export async function updateUserAction(id: string, data: Partial<User>): Promise<User> {
  const updatedUser = await userService.update(id, data);
  revalidatePath('/dashboard/users');
  return updatedUser;
}

export async function deleteUserAction(id: string): Promise<void> {
  await userService.delete(id);
  revalidatePath('/dashboard/users');
}

export async function verifyUserPasswordAction(email: string, passwordAttempt: string): Promise<User | null> {
    const user = await userService.getByEmail(email);
    if (!user || !user.password) {
        return null;
    }
    
    const isMatch = await bcrypt.compare(passwordAttempt, user.password);

    if (isMatch) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
    }

    return null;
}

import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateTransactionData {
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  date: string;
  notes?: string;
  categoryId: string;
}

export interface UpdateTransactionData {
  type?: 'INCOME' | 'EXPENSE';
  amount?: number;
  description?: string;
  date?: string;
  notes?: string;
  categoryId?: string;
}

export interface CreateCategoryData {
  name: string;
  type: 'INCOME' | 'EXPENSE';
}
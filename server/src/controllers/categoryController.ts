import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest, CreateCategoryData } from '../types';

export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { type } = req.query;

    const where: any = { userId };
    if (type && (type === 'INCOME' || type === 'EXPENSE')) {
      where.type = type;
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: [
        { type: 'asc' },
        { name: 'asc' }
      ]
    });

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { name, type }: CreateCategoryData = req.body;

    // Check if category already exists for this user
    const existingCategory = await prisma.category.findFirst({
      where: { userId, name, type }
    });

    if (existingCategory) {
      return res.status(400).json({ 
        error: `Category '${name}' already exists for ${type.toLowerCase()} transactions` 
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        type,
        userId,
      }
    });

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { name, type } = req.body;

    // Check if category exists and belongs to user
    const existingCategory = await prisma.category.findFirst({
      where: { id, userId }
    });

    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if updated name conflicts with existing category
    if (name && name !== existingCategory.name) {
      const conflictingCategory = await prisma.category.findFirst({
        where: { 
          userId, 
          name, 
          type: type || existingCategory.type,
          id: { not: id }
        }
      });

      if (conflictingCategory) {
        return res.status(400).json({ 
          error: `Category '${name}' already exists for ${(type || existingCategory.type).toLowerCase()} transactions` 
        });
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
      }
    });

    res.json({
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Check if category exists and belongs to user
    const category = await prisma.category.findFirst({
      where: { id, userId }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if category has transactions
    const transactionCount = await prisma.transaction.count({
      where: { categoryId: id }
    });

    if (transactionCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete category. It has ${transactionCount} associated transactions.` 
      });
    }

    await prisma.category.delete({
      where: { id }
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
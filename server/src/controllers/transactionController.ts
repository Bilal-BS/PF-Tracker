import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest, CreateTransactionData, UpdateTransactionData } from '../types';

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { page = '1', limit = '50', type, categoryId, startDate, endDate } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = { userId };
    
    if (type && (type === 'INCOME' || type === 'EXPENSE')) {
      where.type = type;
    }
    
    if (categoryId) {
      where.categoryId = categoryId as string;
    }
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              type: true,
            }
          }
        },
        orderBy: { date: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.transaction.count({ where })
    ]);

    res.json({
      transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        }
      }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { type, amount, description, date, notes, categoryId }: CreateTransactionData = req.body;

    // Verify category belongs to user
    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId }
    });

    if (!category) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Verify category type matches transaction type
    if (category.type !== type) {
      return res.status(400).json({ 
        error: `Category type (${category.type}) does not match transaction type (${type})` 
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount,
        description,
        date: new Date(date),
        notes,
        userId,
        categoryId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        }
      }
    });

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const updateData: UpdateTransactionData = req.body;

    // Check if transaction exists and belongs to user
    const existingTransaction = await prisma.transaction.findFirst({
      where: { id, userId }
    });

    if (!existingTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // If categoryId is being updated, verify it belongs to user
    if (updateData.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: updateData.categoryId, userId }
      });

      if (!category) {
        return res.status(400).json({ error: 'Invalid category' });
      }

      // Verify category type matches transaction type
      const transactionType = updateData.type || existingTransaction.type;
      if (category.type !== transactionType) {
        return res.status(400).json({ 
          error: `Category type (${category.type}) does not match transaction type (${transactionType})` 
        });
      }
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...updateData,
        date: updateData.date ? new Date(updateData.date) : undefined,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        }
      }
    });

    res.json({
      message: 'Transaction updated successfully',
      transaction
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Check if transaction exists and belongs to user
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await prisma.transaction.delete({
      where: { id }
    });

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTransactionSummary = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { startDate, endDate, groupBy = 'month' } = req.query;

    // Build date filter
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate as string);
    if (endDate) dateFilter.lte = new Date(endDate as string);

    const where = {
      userId,
      ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
    };

    // Get total income and expenses
    const [incomeSum, expenseSum] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...where, type: 'INCOME' },
        _sum: { amount: true }
      }),
      prisma.transaction.aggregate({
        where: { ...where, type: 'EXPENSE' },
        _sum: { amount: true }
      })
    ]);

    const totalIncome = Number(incomeSum._sum.amount || 0);
    const totalExpenses = Number(expenseSum._sum.amount || 0);
    const balance = totalIncome - totalExpenses;

    // Get category-wise summary
    const categoryStats = await prisma.transaction.groupBy({
      by: ['categoryId', 'type'],
      where,
      _sum: { amount: true },
      _count: true,
    });

    // Get category details
    const categoryIds = categoryStats.map(stat => stat.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true, type: true }
    });

    const categoryMap = new Map(categories.map(cat => [cat.id, cat]));
    
    const categorySummary = categoryStats.map(stat => ({
      category: categoryMap.get(stat.categoryId),
      type: stat.type,
      total: Number(stat._sum.amount || 0),
      count: stat._count
    }));

    res.json({
      summary: {
        totalIncome,
        totalExpenses,
        balance,
        transactionCount: await prisma.transaction.count({ where })
      },
      categorySummary
    });
  } catch (error) {
    console.error('Get transaction summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
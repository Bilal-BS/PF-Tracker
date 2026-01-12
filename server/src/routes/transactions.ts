import { Router } from 'express';
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary
} from '../controllers/transactionController';
import { validateTransaction, validateRequest } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', getTransactions);
router.get('/summary', getTransactionSummary);
router.get('/:id', getTransaction);
router.post('/', validateTransaction, validateRequest, createTransaction);
router.put('/:id', validateTransaction, validateRequest, updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
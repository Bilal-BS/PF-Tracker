import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';
import { validateCategory, validateRequest } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', getCategories);
router.post('/', validateCategory, validateRequest, createCategory);
router.put('/:id', validateCategory, validateRequest, updateCategory);
router.delete('/:id', deleteCategory);

export default router;
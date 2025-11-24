import express from 'express';
import {
  getProducts,
  createProduct,
  getProductById,
} from '../controllers/productController';
import { validateProduct } from '../middleware/validation';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', validateProduct, createProduct);

export default router;


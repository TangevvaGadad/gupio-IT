import express from 'express';
import {
  getOrders,
  createOrder,
  getOrderById,
} from '../controllers/orderController';
import { validateOrder } from '../middleware/validation';

const router = express.Router();

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', validateOrder, createOrder);

export default router;


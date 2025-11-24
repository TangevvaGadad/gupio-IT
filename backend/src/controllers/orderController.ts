import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import Product from '../models/Product';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate('items.productId', 'name price')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'items.productId',
      'name price'
    );
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
    res.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message,
    });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items } = req.body;

    // Validate and calculate order items with stock check
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      if (product.stock < item.qty) {
        throw new Error(
          `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.qty}`
        );
      }

      const itemTotal = product.price * item.qty;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product._id,
        qty: item.qty,
        price: product.price,
        name: product.name,
      });

      // Reduce stock
      product.stock -= item.qty;
      await product.save({ session });
    }

    // Create order
    const order = new Order({
      items: orderItems,
      totalAmount,
      status: 'pending',
    });

    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    const populatedOrder = await Order.findById(order._id).populate(
      'items.productId',
      'name price'
    );

    res.status(201).json({
      success: true,
      data: populatedOrder,
      message: 'Order created successfully',
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({
      success: false,
      message: 'Error creating order',
      error: error.message,
    });
  }
};


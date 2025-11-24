import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product';

dotenv.config();

const seedProducts = [
  {
    name: 'Fresh Organic Tomatoes',
    price: 3.50,
    stock: 50,
    category: 'Fruits & Vegetables',
  },
  {
    name: 'Keto Crunch Snacks',
    price: 4.99,
    stock: 30,
    category: 'Snacks',
  },
  {
    name: 'Watermelon',
    price: 0.99,
    stock: 25,
    category: 'Fruits & Vegetables',
  },
  {
    name: 'Coconut Water',
    price: 3.00,
    stock: 40,
    category: 'Beverages',
  },
  {
    name: 'Fresh Bread',
    price: 2.50,
    stock: 15,
    category: 'Bread & Bakery',
  },
  {
    name: 'Organic Flour',
    price: 5.99,
    stock: 20,
    category: 'Flour & Baking',
  },
  {
    name: 'Fresh Pizza',
    price: 12.99,
    stock: 10,
    category: 'Fresh Meals & Pizzas',
  },
  {
    name: 'Premium Beef',
    price: 15.99,
    stock: 8,
    category: 'Fresh Meat',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/gupio-inventory'
    );
    console.log(' Connected to MongoDB');

    await Product.deleteMany({});
    console.log('  Cleared existing products');

    await Product.insertMany(seedProducts);
    console.log(' Seeded products successfully');

    process.exit(0);
  } catch (error) {
    console.error(' Seeding error:', error);
    process.exit(1);
  }
};

seed();


import Product from '../models/Product';

const initialProducts = [
  {
    name: 'Organic Farm Tomatoes',
    price: 3.25,
    stock: 60,
    category: 'Fruits & Vegetables',
  },
  {
    name: 'Artisan Sourdough Bread',
    price: 5.5,
    stock: 35,
    category: 'Bread & Bakery',
  },
  {
    name: 'Cold Pressed Coconut Water',
    price: 4.2,
    stock: 40,
    category: 'Beverages',
  },
  {
    name: 'Gluten Free Almond Flour',
    price: 8.75,
    stock: 25,
    category: 'Flour & Baking',
  },
  {
    name: 'Grass-Fed Greek Yogurt',
    price: 6.0,
    stock: 30,
    category: 'Dairy',
  },
  {
    name: 'New York Style Bagels',
    price: 7.5,
    stock: 20,
    category: 'Fresh Meals & Pizzas',
  },
];

export async function seedInitialProducts() {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(initialProducts);
  }
}



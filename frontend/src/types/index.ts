export interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string | Product;
  qty: number;
  price: number;
  name: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: {
    productId: string;
    qty: number;
  }[];
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}


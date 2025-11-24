import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchProducts } from '../store/slices/productSlice';
import { createOrder } from '../store/slices/orderSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { formatCurrency } from '../lib/utils';
import { useToast } from '../hooks/use-toast';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { CartItem } from '../types';

export default function PlaceOrder() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { products } = useAppSelector((state) => state.products);
  const { loading } = useAppSelector((state) => state.orders);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const availableProducts = products.filter((p) => p.stock > 0);

  const addToCart = () => {
    if (!selectedProductId) {
      toast({
        title: 'Error',
        description: 'Please select a product',
        variant: 'destructive',
      });
      return;
    }

    const product = products.find((p) => p._id === selectedProductId);
    if (!product) return;

    const existingItem = cart.find((item) => item.productId === product._id);

    if (existingItem) {
      if (existingItem.qty >= product.stock) {
        toast({
          title: 'Error',
          description: `Only ${product.stock} units available in stock`,
          variant: 'destructive',
        });
        return;
      }
      setCart(
        cart.map((item) =>
          item.productId === product._id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          qty: 1,
        },
      ]);
    }

    setSelectedProductId('');
  };

  const updateQuantity = (productId: string, newQty: number) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    if (newQty > product.stock) {
      toast({
        title: 'Error',
        description: `Only ${product.stock} units available in stock`,
        variant: 'destructive',
      });
      return;
    }

    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(cart.map((item) => (item.productId === productId ? { ...item, qty: newQty } : item)));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one product to the cart',
        variant: 'destructive',
      });
      return;
    }

    try {
      await dispatch(
        createOrder({
          items: cart.map((item) => ({
            productId: item.productId,
            qty: item.qty,
          })),
        })
      ).unwrap();

      toast({
        title: 'Success',
        description: 'Order placed successfully!',
      });

      setCart([]);
      navigate('/orders');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to place order',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-white rounded-xl p-6 border border-green-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Place Your Order</h1>
        <p className="text-gray-600">Select fresh products and quantities to place an order</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Product Selection */}
        <Card className="border-2">
          <CardHeader className="bg-green-50 rounded-t-lg">
            <CardTitle className="text-xl">Add Products</CardTitle>
            <CardDescription>Select a product and add it to your cart</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.map((product) => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.name} - {formatCurrency(product.price)} (Stock: {product.stock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addToCart} className="w-full" disabled={!selectedProductId}>
              <Plus className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </CardContent>
        </Card>

        {/* Cart */}
        <Card className="border-2 border-local-green">
          <CardHeader className="bg-local-green text-white rounded-t-lg">
            <CardTitle className="flex items-center text-white">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart ({cart.length})
            </CardTitle>
            <CardDescription className="text-green-50">Review your order items</CardDescription>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 py-8">Your cart is empty</div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => {
                  const product = products.find((p) => p._id === item.productId);
                  return (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          {formatCurrency(item.price)} × {item.qty}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.productId, item.qty - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.qty}
                          onChange={(e) =>
                            updateQuantity(item.productId, parseInt(e.target.value) || 0)
                          }
                          className="w-16 text-center"
                          min="1"
                          max={product?.stock || 0}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.productId, item.qty + 1)}
                          disabled={item.qty >= (product?.stock || 0)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                <div className="border-t-2 border-gray-200 pt-4 mt-4">
                  <div className="flex items-center justify-between text-xl font-bold bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-700">Total Amount</span>
                    <span className="text-local-green text-2xl">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-local-green hover:bg-local-green-dark text-white text-lg py-6 font-semibold"
                  disabled={loading || cart.length === 0}
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


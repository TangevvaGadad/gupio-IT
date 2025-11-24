import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchProducts } from '../store/slices/productSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { formatCurrency } from '../lib/utils';
import { Package, AlertTriangle } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export default function ProductInventory() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const isLowStock = (stock: number) => stock < 10;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-50 via-white to-green-50 rounded-2xl p-8 md:p-12 overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-green-500 text-xl">★</span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Fresh Organic <span className="text-local-green">Delivery</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Locally sourced & delivered to your doorstep
          </p>
          <Button className="bg-gray-900 text-white hover:bg-gray-800">
            SHOP NOW
          </Button>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <p className="text-gray-600 mt-1">Browse our fresh product inventory</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Card
            key={product._id}
            className={`transition-all hover:shadow-xl hover:scale-105 cursor-pointer ${
              isLowStock(product.stock) ? 'border-orange-300 border-2' : 'border-gray-200'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm text-gray-500">
                    {product.category}
                  </CardDescription>
                </div>
                {isLowStock(product.stock) && (
                  <Badge variant="destructive" className="ml-2 animate-pulse">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Low Stock
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-sm font-medium text-gray-600">Price</span>
                  <span className="text-xl font-bold text-local-green">
                    {formatCurrency(product.price)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Package className="h-4 w-4 mr-1.5" />
                    Stock Available
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      isLowStock(product.stock) ? 'text-orange-600' : 'text-gray-900'
                    }`}
                  >
                    {product.stock} units
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">No products found</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


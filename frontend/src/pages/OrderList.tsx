import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchOrders } from '../store/slices/orderSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { formatCurrency, formatDate } from '../lib/utils';
import { FileText, Package } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrderList() {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
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
      <div className="bg-gradient-to-r from-green-50 to-white rounded-xl p-6 border border-green-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
        <p className="text-gray-600">View all placed orders and their status</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order._id} className="hover:shadow-xl transition-all border-2 hover:border-local-green">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center text-lg">
                    <FileText className="h-5 w-5 mr-2 text-local-green" />
                    Order #{order._id.slice(-8).toUpperCase()}
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm">
                    Placed on {formatDate(order.createdAt)}
                  </CardDescription>
                </div>
                <Badge className={`${statusColors[order.status]} font-semibold px-3 py-1`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    Items ({order.items.length})
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                      >
                        <span>
                          {typeof item.productId === 'object' && item.productId
                            ? item.productId.name
                            : item.name}{' '}
                          × {item.qty}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(item.price * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t-2 border-gray-200 pt-4 mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="font-bold text-lg text-gray-700">Total Amount</span>
                  <span className="text-2xl font-bold text-local-green">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500 py-8">No orders found</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Package, FileText, Search, User } from 'lucide-react';
import { Button } from './ui/button';
import { Toaster } from './ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Promo Bar */}
      <div className="bg-gray-800 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center text-sm">
          <span>✨ Save 20% use code: BULK20</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Navigation */}
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-3xl font-bold text-local-green" style={{ fontFamily: 'cursive' }}>
                Local
              </div>
            </Link>
            
            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-local-green focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Secondary Navigation */}
          <div className="flex items-center justify-between h-12 border-t border-gray-100">
            <nav className="flex items-center space-x-6">
              <Link to="/products">
                <Button
                  variant={isActive('/products') || isActive('/') ? 'default' : 'ghost'}
                  className="flex items-center space-x-2 h-10"
                >
                  <Package className="h-4 w-4" />
                  <span>Products</span>
                </Button>
              </Link>
              <Link to="/orders/new">
                <Button
                  variant={isActive('/orders/new') ? 'default' : 'ghost'}
                  className="flex items-center space-x-2 h-10"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Place Order</span>
                </Button>
              </Link>
              <Link to="/orders">
                <Button
                  variant={isActive('/orders') ? 'default' : 'ghost'}
                  className="flex items-center space-x-2 h-10"
                >
                  <FileText className="h-4 w-4" />
                  <span>Orders</span>
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <Toaster />
    </div>
  );
}


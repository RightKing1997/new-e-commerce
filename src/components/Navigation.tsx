import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Package, LogOut, User, Home, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

export const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { itemCount } = useCart(user?.id);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600" />
            ShopHub
          </Link>
          
          {user && (
            <div className="hidden md:flex items-center gap-1">
              <Button
                variant={isActive('/') ? 'secondary' : 'ghost'}
                size="sm"
                asChild
              >
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Products
                </Link>
              </Button>
              
              <Button
                variant={isActive('/orders') ? 'secondary' : 'ghost'}
                size="sm"
                asChild
              >
                <Link to="/orders">
                  <Package className="h-4 w-4 mr-2" />
                  Orders
                </Link>
              </Button>
              
              <Button
                variant={isActive('/admin') ? 'secondary' : 'ghost'}
                size="sm"
                asChild
              >
                <Link to="/admin">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="relative"
                asChild
              >
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {itemCount}
                    </Badge>
                  )}
                </Link>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              asChild
            >
              <Link to="/auth">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

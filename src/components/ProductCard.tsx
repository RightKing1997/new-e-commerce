import { ShoppingCart, Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  featured: boolean;
  stock_quantity: number;
  onAddToCart: (id: string) => void;
}

export const ProductCard = ({
  id,
  name,
  description,
  price,
  image_url,
  category,
  featured,
  stock_quantity,
  onAddToCart,
}: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image_url}
          alt={name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {featured && (
          <Badge className="absolute top-2 right-2 bg-gradient-to-r from-primary to-purple-600">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        )}
        {stock_quantity === 0 && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <Badge variant="secondary" className="mb-2">
              {category}
            </Badge>
            <h3 className="font-semibold text-lg leading-tight">{name}</h3>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            ${price.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">
            {stock_quantity > 0 ? `${stock_quantity} in stock` : 'Unavailable'}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={() => onAddToCart(id)}
          disabled={stock_quantity === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    image_url: string;
  };
}

export const useCart = (userId: string | undefined) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchCart();
    } else {
      setCartItems([]);
      setLoading(false);
    }
  }, [userId]);

  const fetchCart = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        quantity,
        products (
          name,
          price,
          image_url
        )
      `)
      .eq('user_id', userId);

    if (error) {
      toast({
        title: 'Error loading cart',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setCartItems(data as any);
    }
    setLoading(false);
  };

  const addToCart = async (productId: string) => {
    if (!userId) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to cart',
        variant: 'destructive',
      });
      return;
    }

    const existingItem = cartItems.find(item => item.product_id === productId);

    if (existingItem) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + 1 })
        .eq('id', existingItem.id);

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        fetchCart();
        toast({
          title: 'Updated cart',
          description: 'Item quantity increased',
        });
      }
    } else {
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          product_id: productId,
          quantity: 1,
        });

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        fetchCart();
        toast({
          title: 'Added to cart',
          description: 'Item added successfully',
        });
      }
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      fetchCart();
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      fetchCart();
      toast({
        title: 'Removed from cart',
        description: 'Item removed successfully',
      });
    }
  };

  const clearCart = async () => {
    if (!userId) return;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      fetchCart();
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.product.price * item.quantity),
    0
  );

  return {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalAmount,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
  };
};

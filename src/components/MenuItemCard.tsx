import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/components/ui/use-toast";
import { Minus, Plus, ShoppingCart } from 'lucide-react';

interface MenuItemCardProps {
  id: string | number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  onAddToCart: (itemId: string | number, quantity: number) => void;
  initialQuantity?: number; // Optional, if we want to pre-fill quantity (e.g., from cart)
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  onAddToCart,
  initialQuantity = 1,
}) => {
  const [quantity, setQuantity] = useState<number>(initialQuantity > 0 ? initialQuantity : 1);
  const { toast } = useToast();

  console.log(`MenuItemCard loaded for: ${name}`);

  const handleIncrement = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrement = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleAddToCartClick = () => {
    onAddToCart(id, quantity);
    toast({
      title: "Added to Cart",
      description: `${quantity} x ${name} added to your cart.`,
    });
  };

  return (
    <Card className="w-full overflow-hidden flex flex-col md:flex-row group transition-all duration-300 hover:shadow-lg">
      <div className="md:w-1/3 w-full">
        <AspectRatio ratio={16 / 9} className="md:h-full">
          <img
            src={imageUrl || 'https://via.placeholder.com/300x200?text=Food+Item'}
            alt={name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </AspectRatio>
      </div>

      <div className="md:w-2/3 flex flex-col justify-between p-4">
        <div>
          <CardTitle className="text-xl font-semibold mb-1">{name}</CardTitle>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
          <p className="text-lg font-bold text-green-600 mb-3">${price.toFixed(2)}</p>
        </div>

        <CardFooter className="p-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handleDecrement} aria-label="Decrease quantity">
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium w-8 text-center" aria-live="polite">{quantity}</span>
            <Button variant="outline" size="icon" onClick={handleIncrement} aria-label="Increase quantity">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleAddToCartClick} className="w-full sm:w-auto mt-2 sm:mt-0">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default MenuItemCard;
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Star } from 'lucide-react';

interface RestaurantCardProps {
  id: string | number; // For React key, potentially other uses
  slug: string; // Unique identifier for the restaurant, used in the URL
  name: string;
  imageUrl: string;
  cuisineTypes: string[]; // e.g., ["Italian", "Pizza", "Fast Food"]
  rating: number; // e.g., 4.5
  deliveryTime: string; // e.g., "25-35 min"
  promotionalTag?: string; // Optional e.g., "20% OFF", "Free Delivery"
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  slug,
  name,
  imageUrl,
  cuisineTypes,
  rating,
  deliveryTime,
  promotionalTag,
}) => {
  console.log(`RestaurantCard loaded for: ${name}, slug: ${slug}, id: ${id}`);

  return (
    <Link 
      to={`/restaurant?slug=${slug}`} 
      className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
      aria-label={`View details for ${name}`}
    >
      <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-full bg-card">
        <CardHeader className="p-0 relative">
          <AspectRatio ratio={16 / 9}>
            <img
              src={imageUrl || 'https://via.placeholder.com/400x225?text=Restaurant+Image'}
              alt={`Promotional image for ${name}`}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </AspectRatio>
          {promotionalTag && (
            <Badge 
              variant="default" // Uses primary color by default
              className="absolute top-2 right-2 z-10 px-2 py-1 text-xs font-semibold"
            >
              {promotionalTag}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="p-3 md:p-4 flex-grow flex flex-col space-y-2">
          <h3 className="text-base md:text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2" title={name}>
            {name}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-1" title={cuisineTypes.join(', ')}>
            {cuisineTypes.join(', ')}
          </p>
          
          <div className="mt-auto flex items-center justify-between text-xs md:text-sm pt-2">
            <div className="flex items-center">
              <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="font-medium">{rating.toFixed(1)}</span>
            </div>
            <span className="text-muted-foreground">{deliveryTime}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RestaurantCard;
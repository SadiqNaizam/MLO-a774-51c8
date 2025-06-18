import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

// Custom Components
import MenuItemCard from '@/components/MenuItemCard';

// shadcn/ui Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

// Lucide Icons
import { Star, Clock, MapPin, ChevronLeft, ShoppingCart, AlertTriangle } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface MenuCategory {
  name: string;
  items: MenuItem[];
}

interface Review {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
}

interface Restaurant {
  slug: string;
  name: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  address: string;
  cuisineTypes: string[];
  menu: {
    categories: MenuCategory[];
  };
  reviews?: Review[];
}

// Mock Data (simulating API response)
const MOCK_RESTAURANTS_DB: Record<string, Restaurant> = {
  "the-pizza-place": {
    slug: "the-pizza-place",
    name: "The Pizza Place Deluxe",
    bannerImageUrl: "https://images.unsplash.com/photo-1593504049359-74330189a345?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGl6emElMjByZXN0YXVyYW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    reviewCount: 320,
    deliveryTime: "25-35 min",
    address: "123 Pizza St, Foodville",
    cuisineTypes: ["Pizza", "Italian", "Calzones"],
    menu: {
      categories: [
        {
          name: "Appetizers",
          items: [
            { id: "app1", name: "Garlic Bread Supreme", description: "Crusty bread with garlic butter, cheese, and herbs.", price: 7.99, imageUrl: "https://images.unsplash.com/photo-1627308594191-76F3c1d3f387?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z2FybGljJTIwYnJlYWR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60" },
            { id: "app2", name: "Mozzarella Sticks", description: "Golden fried mozzarella sticks with rich marinara sauce.", price: 8.50, imageUrl: "https://images.unsplash.com/photo-1632211094901-c3d6e2841705?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW96emFyZWxsYSUyMHN0aWNrc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60" },
          ],
        },
        {
          name: "Pizzas",
          items: [
            { id: "pizza1", name: "Margherita Classico", description: "Classic margherita with San Marzano tomatoes, fresh mozzarella, and basil.", price: 14.00, imageUrl: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFyZ2hlcml0YSUyMHBpenphfGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60" },
            { id: "pizza2", name: "Pepperoni Feast", description: "Loaded with premium spicy pepperoni and a blend of cheeses.", price: 16.50, imageUrl: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVwcGVyb25pJTIwcGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60" },
            { id: "pizza3", name: "Veggie Supreme", description: "A colorful mix of fresh garden vegetables on a cheesy crust.", price: 15.75, imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dmVnZ2llJTIwcGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60" },
          ],
        },
        {
          name: "Desserts",
          items: [
            { id: "des1", name: "Molten Chocolate Lava Cake", description: "Warm, rich chocolate cake with a gooey, molten center. Served with a scoop of vanilla ice cream.", price: 7.25, imageUrl: "https://images.unsplash.com/photo-1616051086925-4e358f844a33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hvY29sYXRlJTIwbGF2YSUyMGNha2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60" },
          ],
        },
      ],
    },
    reviews: [
      { id: "rev1", userName: "Alice B.", rating: 5, comment: "Absolutely delicious pizza! The crust was perfect and toppings were fresh. Delivery was quick too.", date: "2 days ago" },
      { id: "rev2", userName: "Bob K.", rating: 4, comment: "Good food, fair prices. The garlic bread is a must-try.", date: "1 week ago" },
    ]
  },
  "sushi-heaven": {
    slug: "sushi-heaven",
    name: "Sushi Heaven",
    bannerImageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3VzaGklMjByZXN0YXVyYW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    reviewCount: 450,
    deliveryTime: "30-40 min",
    address: "456 Sushi Ave, Foodville",
    cuisineTypes: ["Sushi", "Japanese", "Asian Fusion"],
    menu: {
      categories: [
        {
          name: "Signature Rolls",
          items: [
            { id: "sushi_roll1", name: "Dragon Roll", description: "Eel, cucumber, topped with avocado and eel sauce.", price: 15.00, imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VzaGklMjByb2xsfGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60" },
            { id: "sushi_roll2", name: "Rainbow Roll", description: "Crab, avocado, cucumber, topped with assorted fish.", price: 16.50, imageUrl: "https://images.unsplash.com/photo-1607301405390-6210bc8aa00f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmFpbmJvdyUyMHJvbGx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60" },
          ],
        },
        {
          name: "Nigiri & Sashimi",
          items: [
            { id: "sushi_nigiri1", name: "Salmon Nigiri (2pc)", description: "Fresh salmon over seasoned rice.", price: 7.00, imageUrl: "https://images.unsplash.com/photo-1620402094093-c28899617bf5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FsbW9uJTIwbmlnaXJpfGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60" },
            { id: "sushi_sashimi1", name: "Tuna Sashimi (5pc)", description: "Slices of fresh, premium tuna.", price: 12.00, imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHVuYSUyMHNhc2hpbWl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60" },
          ],
        },
      ],
    },
    reviews: [
        { id: "srev1", userName: "Chadwick Boseman", rating: 5, comment: "Freshest sushi in town by far. The Dragon Roll is epic!", date: "3 days ago" },
    ]
  },
};


const RestaurantPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const restaurantSlug = searchParams.get('slug');
  
  const [restaurantData, setRestaurantData] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log('RestaurantPage loaded. Slug:', restaurantSlug);
    setIsLoading(true);
    setError(null);
    // Simulate API call
    setTimeout(() => {
      if (restaurantSlug && MOCK_RESTAURANTS_DB[restaurantSlug]) {
        setRestaurantData(MOCK_RESTAURANTS_DB[restaurantSlug]);
      } else {
        setError(`Restaurant with slug "${restaurantSlug}" not found.`);
      }
      setIsLoading(false);
    }, 1000);
  }, [restaurantSlug]);

  const handleAddToCart = (itemId: string | number, quantity: number) => {
    const item = restaurantData?.menu.categories
      .flatMap(cat => cat.items)
      .find(i => i.id === itemId);
    if (item) {
      console.log(`Added ${quantity} of ${item.name} (ID: ${itemId}) to cart from ${restaurantData?.name}.`);
      toast({
        title: "Item Added to Cart!",
        description: `${quantity} x ${item.name} has been added to your cart.`,
        action: (
          <Link to="/cart-checkout">
            <Button variant="outline" size="sm">View Cart</Button>
          </Link>
        ),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-0 animate-pulse">
        <Skeleton className="h-8 w-48 mb-4" /> {/* Back button skeleton */}
        <Skeleton className="w-full h-64 md:h-80 rounded-lg mb-4" /> {/* Banner skeleton */}
        <Skeleton className="h-10 w-3/4 mb-2" /> {/* Name skeleton */}
        <div className="flex space-x-4 mb-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex space-x-2 mb-6">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-8 w-32 mb-4" /> {/* Menu title skeleton */}
        <div className="flex space-x-3 mb-4 pb-2 border-b">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="flex flex-col md:flex-row">
                <Skeleton className="md:w-1/3 w-full h-40 md:h-full" />
                <div className="md:w-2/3 p-4 space-y-3">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-5 w-1/4" />
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !restaurantData) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
         <Link to="/" className="inline-flex items-center text-sm text-primary hover:underline mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to All Restaurants
        </Link>
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 mr-2 text-destructive" />
                    Restaurant Not Found
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{error || "The restaurant you are looking for could not be found."}</p>
                <Button asChild className="mt-6">
                    <Link to="/">Browse Restaurants</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  const defaultTab = restaurantData.menu.categories[0]?.name || "";

  return (
    <div className="min-h-screen bg-background pb-20"> {/* Added pb-20 for MobileBottomNavigationBar */}
      {/* AppHeader and MobileBottomNavigationBar are assumed to be part of a global layout */}

      <main className="container mx-auto py-6 px-2 sm:px-4">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 group">
          <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
          Back to All Restaurants
        </Link>

        {/* Restaurant Info Section */}
        <section aria-labelledby="restaurant-heading" className="mb-8">
          <div className="relative w-full h-56 sm:h-64 md:h-80 rounded-lg overflow-hidden shadow-lg group">
            <img 
              src={restaurantData.bannerImageUrl} 
              alt={`Banner for ${restaurantData.name}`} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
                <h1 id="restaurant-heading" className="text-3xl md:text-4xl font-bold drop-shadow-md">{restaurantData.name}</h1>
            </div>
          </div>
          
          <div className="mt-4 p-1">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="font-medium">{restaurantData.rating.toFixed(1)}</span>
                <span className="ml-1">({restaurantData.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-1" />
                <span>{restaurantData.deliveryTime}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-1" />
                <span>{restaurantData.address}</span>
              </div>
            </div>
            <div className="mt-3">
              {restaurantData.cuisineTypes.map(cuisine => (
                <Badge key={cuisine} variant="secondary" className="mr-2 mb-2 px-3 py-1 text-xs">{cuisine}</Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Menu Section using Tabs */}
        <section aria-labelledby="menu-heading" className="mb-8">
          <h2 id="menu-heading" className="text-2xl font-semibold mb-4">Menu</h2>
          {restaurantData.menu.categories.length > 0 ? (
            <Tabs defaultValue={defaultTab} className="w-full">
              <ScrollArea className="w-full whitespace-nowrap rounded-md border mb-1">
                <TabsList className="p-1.5 sm:p-2">
                  {restaurantData.menu.categories.map(category => (
                    <TabsTrigger key={category.name} value={category.name} className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm">
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              {restaurantData.menu.categories.map(category => (
                <TabsContent key={category.name} value={category.name} className="mt-6">
                  {category.items.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8">
                      {category.items.map(item => (
                        <MenuItemCard
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          description={item.description}
                          price={item.price}
                          imageUrl={item.imageUrl}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>
                  ) : (
                     <p className="text-muted-foreground text-center py-4">No items in this category yet.</p>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <p className="text-muted-foreground">No menu categories available for this restaurant.</p>
          )}
        </section>

        {/* User Reviews Section */}
        {restaurantData.reviews && restaurantData.reviews.length > 0 && (
            <section aria-labelledby="reviews-heading" className="mb-8">
                <h2 id="reviews-heading" className="text-2xl font-semibold mb-4">User Reviews</h2>
                <Card>
                    <CardContent className="pt-6">
                        <ScrollArea className="h-auto max-h-[400px] pr-3">
                            <div className="space-y-6">
                            {restaurantData.reviews.map((review) => (
                                <div key={review.id} className="pb-4 border-b last:border-b-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold text-md">{review.userName}</h4>
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-1">{review.date}</p>
                                    <p className="text-sm">{review.comment}</p>
                                </div>
                            ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </section>
        )}

        {/* Sticky View Cart Button (Optional, could be in MobileBottomNavigationBar) */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-background border-t p-3 shadow-top-lg z-40"> 
           {/* This is a simplified example. MobileBottomNavigationBar is likely more complex and global. */}
           <Button asChild size="lg" className="w-full">
                <Link to="/cart-checkout">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    View Cart & Checkout
                </Link>
            </Button>
        </div>
         <div className="hidden md:flex justify-center mt-8 mb-8">
            <Button asChild size="lg">
                <Link to="/cart-checkout">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    View Cart & Checkout
                </Link>
            </Button>
        </div>


      </main>
      {/* AppFooter is assumed to be part of a global layout */}
    </div>
  );
};

export default RestaurantPage;
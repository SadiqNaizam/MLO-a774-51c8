import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Custom Components
import RestaurantCard from '@/components/RestaurantCard';
import CuisineFilterChip from '@/components/CuisineFilterChip';

// Shadcn/UI Components
import { Input } from '@/components/ui/input';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

// Lucide Icons
import { Search, User, Home as HomeIcon, ShoppingBag, ListOrdered, MapPin, Utensils } from 'lucide-react';

// Sample Data
const promotions = [
  { id: 'p1', title: '50% Off Your First Order!', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=450&fit=crop&q=80', link: '#' },
  { id: 'p2', title: 'Free Delivery Weekend', imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=450&fit=crop&q=80', link: '#' },
  { id: 'p3', title: 'Combo Deals Starting $9.99', imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&h=450&fit=crop&q=80', link: '#' },
];

const cuisineTypes = ['All', 'Pizza', 'Burgers', 'Sushi', 'Italian', 'Mexican', 'Indian', 'Chinese'];

const restaurants = [
  { id: 'r1', slug: 'marios-pizzeria', name: "Mario's Pizzeria", imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=225&fit=crop&q=80', cuisineTypes: ['Pizza', 'Italian'], rating: 4.5, deliveryTime: '25-35 min', promotionalTag: '20% OFF' },
  { id: 'r2', slug: 'burger-bliss', name: 'Burger Bliss', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=225&fit=crop&q=80', cuisineTypes: ['Burgers', 'Fast Food'], rating: 4.2, deliveryTime: '20-30 min' },
  { id: 'r3', slug: 'sushi-central', name: 'Sushi Central', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=225&fit=crop&q=80', cuisineTypes: ['Sushi', 'Japanese'], rating: 4.8, deliveryTime: '30-40 min', promotionalTag: 'Free Appetizer' },
  { id: 'r4', slug: 'taco-fiesta', name: 'Taco Fiesta', imageUrl: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400&h=225&fit=crop&q=80', cuisineTypes: ['Mexican'], rating: 4.6, deliveryTime: '25-35 min' },
  { id: 'r5', slug: 'spice-route', name: 'Spice Route', imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=225&fit=crop&q=80', cuisineTypes: ['Indian'], rating: 4.7, deliveryTime: '35-45 min', promotionalTag: 'New Menu!' },
  { id: 'r6', slug: 'golden-wok', name: 'Golden Wok', imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=225&fit=crop&q=80', cuisineTypes: ['Chinese'], rating: 4.3, deliveryTime: '30-40 min' },
];

const HomePage = () => {
  console.log('HomePage loaded');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(['All']);
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggleCuisine = (cuisineName: string) => {
    setSelectedCuisines(prev => {
      if (cuisineName === 'All') return ['All'];
      const newSelection = prev.filter(c => c !== 'All');
      if (newSelection.includes(cuisineName)) {
        const filtered = newSelection.filter(c => c !== cuisineName);
        return filtered.length === 0 ? ['All'] : filtered;
      } else {
        return [...newSelection, cuisineName];
      }
    });
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesCuisine = selectedCuisines.includes('All') || restaurant.cuisineTypes.some(ct => selectedCuisines.includes(ct));
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) || restaurant.cuisineTypes.some(ct => ct.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCuisine && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* AppHeader Placeholder */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 sm:p-4 flex items-center justify-between shadow-sm">
        <Link to="/" className="flex items-center space-x-2">
          <Utensils className="h-7 w-7 text-primary" />
          <span className="text-xl sm:text-2xl font-bold text-primary hidden sm:inline">FoodApp</span>
        </Link>
        <div className="relative flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-4">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search restaurants or cuisines..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search restaurants or cuisines"
          />
        </div>
        <Link to="/user-profile" className="p-2 rounded-full hover:bg-accent">
          <User className="h-6 w-6 text-muted-foreground" />
          <span className="sr-only">User Profile</span>
        </Link>
      </header>

      <ScrollArea className="flex-grow" style={{ height: 'calc(100vh - 120px)' }}> {/* Adjust height considering header and bottom nav */}
        <main className="container mx-auto px-4 py-6 space-y-8">
          {/* Promotions Carousel */}
          <section aria-labelledby="promotions-heading">
            <h2 id="promotions-heading" className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Today's Offers
            </h2>
            <Carousel
              opts={{ align: "start", loop: true }}
              className="w-full"
            >
              <CarouselContent>
                {promotions.map((promo) => (
                  <CarouselItem key={promo.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Link to={promo.link} aria-label={promo.title}>
                        <div className="aspect-[16/9] rounded-lg overflow-hidden relative group">
                          <img src={promo.imageUrl} alt={promo.title} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                            <h3 className="text-white text-lg font-semibold">{promo.title}</h3>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
            </Carousel>
          </section>

          {/* Cuisine Filters */}
          <section aria-labelledby="cuisines-heading">
            <h2 id="cuisines-heading" className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Categories
            </h2>
            <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
              {cuisineTypes.map((cuisine) => (
                <CuisineFilterChip
                  key={cuisine}
                  cuisineName={cuisine}
                  isSelected={selectedCuisines.includes(cuisine)}
                  onToggle={handleToggleCuisine}
                  className="flex-shrink-0"
                />
              ))}
            </div>
          </section>

          {/* Featured Restaurants */}
          <section aria-labelledby="restaurants-heading">
            <h2 id="restaurants-heading" className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Featured Restaurants
            </h2>
            {filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} {...restaurant} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                <MapPin className="mx-auto h-12 w-12 mb-2" />
                <p className="text-lg font-medium">No restaurants found.</p>
                <p>Try adjusting your search or filters.</p>
              </div>
            )}
          </section>
        </main>
      </ScrollArea>

      {/* AppFooter Placeholder */}
      <footer className="py-4 px-4 text-center text-xs sm:text-sm text-muted-foreground border-t bg-background">
        © {new Date().getFullYear()} FoodApp, Inc. All rights reserved. 
        <Link to="/terms" className="ml-2 hover:underline">Terms</Link> | 
        <Link to="/privacy" className="ml-1 hover:underline">Privacy</Link>
      </footer>

      {/* MobileBottomNavigationBar Placeholder */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t p-2 flex justify-around items-center md:hidden shadow-t-lg z-40">
        <Link to="/" className="flex flex-col items-center text-primary p-1">
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/cart-checkout" className="flex flex-col items-center text-muted-foreground hover:text-primary p-1">
          <ShoppingBag className="h-6 w-6" />
          <span className="text-xs">Cart</span>
        </Link>
        <Link to="/order-tracking" className="flex flex-col items-center text-muted-foreground hover:text-primary p-1">
          <ListOrdered className="h-6 w-6" />
          <span className="text-xs">Orders</span>
        </Link>
        <Link to="/user-profile" className="flex flex-col items-center text-muted-foreground hover:text-primary p-1">
          <User className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default HomePage;
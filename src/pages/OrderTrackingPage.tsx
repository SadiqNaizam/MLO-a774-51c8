import React from 'react';
import { Link } from 'react-router-dom';
import OrderTrackerMap from '@/components/OrderTrackerMap'; // Custom component
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { 
  HomeIcon, 
  MapPinIcon, 
  ShoppingCartIcon, 
  UserIcon, 
  SearchIcon as LucideSearchIcon, // Renamed to avoid conflict if any HTML element uses 'search'
  ListOrderedIcon,
  PackageIcon,
  MenuIcon // For mobile menu toggle icon
} from 'lucide-react';

const OrderTrackingPage = () => {
  console.log('OrderTrackingPage loaded');

  // Placeholder data for current active order
  const activeOrder = {
    id: "FD78901ABC",
    restaurantName: "The Burger Joint",
    userAddress: "456 Oak Avenue, Metropolis, USA",
    status: 'Out for Delivery' as 'Processing' | 'Preparing' | 'Awaiting Rider' | 'Out for Delivery' | 'Delivered' | 'Cancelled',
    agentName: "Jane R.",
    estimatedDelivery: "10-15 minutes remaining",
  };

  // Helper function to determine progress bar value based on status
  const getProgressForStatus = (status: typeof activeOrder.status) => {
    switch (status) {
      case 'Processing': return 10;
      case 'Preparing': return 30;
      case 'Awaiting Rider': return 50;
      case 'Out for Delivery': return 75;
      case 'Delivered': return 100;
      case 'Cancelled': return 0; 
      default: return 0;
    }
  };
  
  const activeOrderProgress = getProgressForStatus(activeOrder.status);

  // Placeholder data for past orders
  const pastOrders = [
    {
      id: "FD12345XYZ",
      date: "July 20, 2024",
      restaurantName: "Pizza Heaven",
      total: 25.99,
      status: "Delivered",
      items: [
        { name: "Pepperoni Pizza", quantity: 1, price: 15.99 },
        { name: "Coke", quantity: 2, price: 5.00 },
      ]
    },
    {
      id: "FD67890DEF",
      date: "July 15, 2024",
      restaurantName: "Sushi Express",
      total: 42.50,
      status: "Delivered",
      items: [
        { name: "Salmon Sashimi", quantity: 1, price: 12.00 },
        { name: "Tuna Roll", quantity: 2, price: 18.00 },
        { name: "Miso Soup", quantity: 1, price: 2.50 },
      ]
    },
     {
      id: "FD007CXL",
      date: "July 10, 2024",
      restaurantName: "Curry House",
      total: 33.75,
      status: "Cancelled",
      items: [
        { name: "Chicken Tikka Masala", quantity: 1, price: 15.00 },
        { name: "Naan Bread", quantity: 2, price: 6.00 },
      ]
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      {/* AppHeader Structure */}
      <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-40 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto flex justify-between items-center h-16 px-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            FoodApp
          </Link>
          <nav className="hidden md:flex items-center space-x-5 lg:space-x-6">
            <Link to="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">Home</Link>
            <Link to="/restaurant" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">Restaurants</Link>
            <Link to="/order-tracking" className="text-sm font-medium text-primary dark:text-primary">My Orders</Link>
            <Link to="/cart-checkout" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors" aria-label="Shopping Cart">
              <ShoppingCartIcon className="h-5 w-5" />
            </Link>
            <Link to="/user-profile" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors" aria-label="User Profile">
              <UserIcon className="h-5 w-5" />
            </Link>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden text-slate-600 dark:text-slate-300"> {/* Placeholder for mobile menu toggle */}
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8 pb-24 md:pb-12">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6 md:mb-8">Order Tracking</h1>

        {/* Current Order Section - Using a placeholder check, in a real app this would come from state/API */}
        {activeOrder ? (
          <section aria-labelledby="current-order-heading" className="mb-10 md:mb-12">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 md:mb-6">
                <h2 id="current-order-heading" className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-200">
                  Current Order: <span className="text-primary">#{activeOrder.id}</span>
                </h2>
                {/* Optional: Contact support button for active order */}
            </div>
            
            <OrderTrackerMap
              orderId={activeOrder.id}
              restaurantName={activeOrder.restaurantName}
              userAddress={activeOrder.userAddress}
              currentOrderStatus={activeOrder.status}
              agentName={activeOrder.agentName}
            />
            <Card className="mt-6 shadow-md dark:bg-slate-800 border dark:border-slate-700">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg md:text-xl">Order Progress</CardTitle>
                <CardDescription>Estimated Delivery: {activeOrder.estimatedDelivery}</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={activeOrderProgress} className="w-full h-3 mb-2" aria-label={`Order progress: ${activeOrderProgress}%`} />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Status: <span className="font-semibold text-primary">{activeOrder.status}</span>
                </p>
              </CardContent>
            </Card>
          </section>
        ) : (
          <section className="mb-10 md:mb-12 text-center py-10 bg-white dark:bg-slate-800 rounded-lg shadow-md border dark:border-slate-700">
            <PackageIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
            <h2 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-2">No Active Orders</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Looks like you don't have any orders on the way.</p>
            <Button asChild size="lg">
              <Link to="/restaurant">Explore Restaurants</Link>
            </Button>
          </section>
        )}

        {/* Past Orders Section */}
        <section aria-labelledby="past-orders-heading">
          <h2 id="past-orders-heading" className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4 md:mb-6">
            Order History
          </h2>
          {pastOrders.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-3">
              {pastOrders.map((order, index) => (
                <AccordionItem value={`item-${index + 1}`} key={order.id} className="bg-white dark:bg-slate-800 shadow-md rounded-lg border dark:border-slate-700/80 overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline text-md font-medium data-[state=open]:bg-slate-50 dark:data-[state=open]:bg-slate-700/50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full text-left sm:text-inherit">
                        <span className="font-semibold">Order #{order.id} <span className="font-normal text-slate-600 dark:text-slate-400 hidden sm:inline">- {order.restaurantName}</span></span>
                        <span className={`text-xs sm:text-sm mt-1 sm:mt-0 px-2 py-0.5 rounded-full font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300'}`}>
                          {order.status} - {order.date}
                        </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-4 border-t dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-1"><strong>Restaurant:</strong> {order.restaurantName}</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-2"><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Items:</h4>
                    <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 mb-3 pl-2 space-y-0.5">
                      {order.items.map(item => (
                        <li key={item.name}>{item.quantity}x {item.name} (${item.price.toFixed(2)})</li>
                      ))}
                    </ul>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">View Receipt</Button>
                      {order.status === 'Delivered' && <Button variant="default" size="sm">Reorder</Button>}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
             <div className="text-center py-10 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
                <ListOrderedIcon className="mx-auto h-10 w-10 text-slate-400 dark:text-slate-500 mb-3" />
                <p className="text-md font-medium text-slate-700 dark:text-slate-300">No past orders found.</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Your previous orders will appear here once you place an order.</p>
            </div>
          )}
        </section>
      </main>

      {/* MobileBottomNavigationBar Structure */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-1 shadow-top z-40">
        <div className="container mx-auto flex justify-around items-center h-14">
          <Link to="/" className="flex flex-col items-center text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors px-2 py-1 rounded-md" aria-label="Home">
            <HomeIcon className="h-5 w-5" /> <span className="text-xs mt-0.5">Home</span>
          </Link>
          <Link to="/restaurant" className="flex flex-col items-center text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors px-2 py-1 rounded-md" aria-label="Explore restaurants">
            <LucideSearchIcon className="h-5 w-5" /> <span className="text-xs mt-0.5">Explore</span>
          </Link>
          <Link to="/order-tracking" className="flex flex-col items-center text-primary dark:text-primary px-2 py-1 rounded-md bg-primary/10 dark:bg-primary/20" aria-label="My Orders"> {/* Current page */}
            <MapPinIcon className="h-5 w-5" /> <span className="text-xs font-semibold mt-0.5">Orders</span>
          </Link>
          <Link to="/cart-checkout" className="flex flex-col items-center text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors px-2 py-1 rounded-md" aria-label="Shopping Cart">
            <ShoppingCartIcon className="h-5 w-5" /> <span className="text-xs mt-0.5">Cart</span>
          </Link>
          <Link to="/user-profile" className="flex flex-col items-center text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors px-2 py-1 rounded-md" aria-label="User Profile">
            <UserIcon className="h-5 w-5" /> <span className="text-xs mt-0.5">Profile</span>
          </Link>
        </div>
      </nav>

      {/* AppFooter Structure */}
      <footer className="bg-slate-100 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700/60 p-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} FoodApp. All rights reserved.</p>
        {/* Simplified footer, avoiding links not in App.tsx */}
      </footer>
    </div>
  );
};

export default OrderTrackingPage;
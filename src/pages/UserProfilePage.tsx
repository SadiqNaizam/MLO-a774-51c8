import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Assuming these are general layout components
// If these paths are incorrect, they need to be adjusted or the components provided.
import AppHeader from '@/components/layout/AppHeader'; // Assumed custom component
import MobileBottomNavigationBar from '@/components/layout/MobileBottomNavigationBar'; // Assumed custom component
import AppFooter from '@/components/layout/AppFooter'; // Assumed custom component

// Custom components
import AddressSelector, { Address } from '@/components/AddressSelector';

// Shadcn/ui components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast"; // For form submission feedback

// Lucide Icons
import { User, Mail, Phone, MapPin, History, Bell, Settings, LogOut, ChevronRight, ShoppingBag, HelpCircle } from 'lucide-react';

// Mock User Data
const mockUser = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "555-123-4567",
  avatarUrl: "https://i.pravatar.cc/150?u=alexjohnson",
  initials: "AJ",
};

// Mock Addresses
const mockAddresses: Address[] = [
  { id: 'addr1', label: 'Home', line1: '123 Willow Creek Ln', city: 'Springfield', state: 'IL', zip: '62704', isDefault: true },
  { id: 'addr2', label: 'Work', line1: '456 Business Park Rd, Suite 100', city: 'Springfield', state: 'IL', zip: '62702' },
];

// Mock Order History
const mockOrderHistory = [
  { id: 'order123', date: '2024-07-20', total: 45.99, status: 'Delivered', restaurantName: 'Pizza Place' },
  { id: 'order456', date: '2024-07-15', total: 22.50, status: 'Delivered', restaurantName: 'Burger Joint' },
  { id: 'order789', date: '2024-06-30', total: 30.75, status: 'Cancelled', restaurantName: 'Sushi Spot' },
];

// Form Schema for Personal Information
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const UserProfilePage = () => {
  console.log('UserProfilePage loaded');
  const navigate = useNavigate();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    mockAddresses.find(addr => addr.isDefault)?.id || (mockAddresses.length > 0 ? mockAddresses[0].id : null)
  );
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: mockUser.name,
      email: mockUser.email,
      phone: mockUser.phone,
    },
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    console.log("Profile updated:", data);
    toast({
      title: "Profile Updated",
      description: "Your personal information has been saved.",
    });
    // Here you would typically call an API to save the data
  }

  const handleAddNewAddress = () => {
    console.log("Add new address clicked");
    // Navigate to an add address page or open a modal
    toast({ title: "Feature Pending", description: "Add new address functionality will be implemented here." });
  };
  
  const handleLogout = () => {
    console.log("Logout clicked");
    // Perform logout logic
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    navigate("/"); // Navigate to home or login page
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Assuming AppHeader takes a title prop */}
      <AppHeader title="My Profile" />

      <ScrollArea className="flex-1">
        <main className="container mx-auto max-w-4xl py-6 px-4 md:py-8 md:px-6 space-y-6 md:space-y-8">
          
          {/* Profile Overview Section */}
          <section className="flex items-center space-x-4 p-4 bg-card dark:bg-slate-800 rounded-lg shadow">
            <Avatar className="h-20 w-20 md:h-24 md:w-24 border-2 border-primary">
              <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
              <AvatarFallback className="text-2xl">{mockUser.initials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-card-foreground dark:text-slate-100">{mockUser.name}</h1>
              <p className="text-muted-foreground dark:text-slate-400">{mockUser.email}</p>
            </div>
          </section>

          {/* Personal Information Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><User className="mr-2 h-5 w-5" /> Personal Information</CardTitle>
              <CardDescription>Manage your name, email, and phone number.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="e.g., 555-123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full sm:w-auto">Save Changes</Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Saved Addresses */}
          <AddressSelector
            savedAddresses={mockAddresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={(id) => setSelectedAddressId(id)}
            onAddNewAddress={handleAddNewAddress}
          />
          
          {/* Order History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><History className="mr-2 h-5 w-5" /> Order History</CardTitle>
              <CardDescription>View your past orders.</CardDescription>
            </CardHeader>
            <CardContent>
              {mockOrderHistory.length > 0 ? (
                <ul className="space-y-4">
                  {mockOrderHistory.map(order => (
                    <li key={order.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <div className="flex-grow mb-2 sm:mb-0">
                        <div className="flex items-center text-sm font-semibold">
                           <ShoppingBag className="mr-2 h-4 w-4 text-primary"/> Order #{order.id} - <span className="ml-1">{order.restaurantName}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Date: {order.date} | Total: ${order.total.toFixed(2)}</p>
                        <p className={`text-xs font-medium ${order.status === 'Delivered' ? 'text-green-600' : order.status === 'Cancelled' ? 'text-red-600' : 'text-yellow-600'}`}>
                          Status: {order.status}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/order-tracking?orderId=${order.id}`}> {/* Path from App.tsx */}
                          View Details <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">You have no past orders.</p>
              )}
            </CardContent>
            {mockOrderHistory.length > 3 && (
                 <CardFooter>
                    <Button variant="link" className="mx-auto">View All Orders</Button>
                 </CardFooter>
            )}
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5" /> Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive updates from us.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                  <span className="font-medium">Email Notifications</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive order updates and promotions via email.
                  </span>
                </Label>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  aria-label="Toggle email notifications"
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                  <span className="font-medium">Push Notifications</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Get real-time alerts on your mobile device.
                  </span>
                </Label>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                  aria-label="Toggle push notifications"
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Account Actions */}
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><Settings className="mr-2 h-5 w-5" /> Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                    <HelpCircle className="mr-3 h-5 w-5 text-muted-foreground"/>
                    <div>
                        <p className="font-medium">Help & Support</p>
                        <p className="text-xs text-muted-foreground">Contact us or find FAQs</p>
                    </div>
                </Button>
                <Button variant="outline" onClick={handleLogout} className="w-full justify-start text-left h-auto py-3 text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 border-red-500/50 hover:border-red-500">
                    <LogOut className="mr-3 h-5 w-5"/>
                     <div>
                        <p className="font-medium">Logout</p>
                        <p className="text-xs text-muted-foreground">Sign out of your account</p>
                    </div>
                </Button>
            </CardContent>
          </Card>

        </main>
      </ScrollArea>

      {/* Assuming MobileBottomNavigationBar is part of the app shell */}
      <MobileBottomNavigationBar />
      {/* Assuming AppFooter is part of the app shell */}
      <AppFooter />
    </div>
  );
};

export default UserProfilePage;

// Simple placeholder for AppHeader if it's not provided elsewhere
// const AppHeader: React.FC<{ title: string }> = ({ title }) => (
//   <header className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0 z-50">
//     <div className="container mx-auto max-w-4xl">
//       <h1 className="text-xl font-semibold">{title}</h1>
//     </div>
//   </header>
// );

// Simple placeholder for MobileBottomNavigationBar if it's not provided elsewhere
// const MobileBottomNavigationBar: React.FC = () => (
//   <nav className="bg-background border-t border-border p-2 fixed bottom-0 w-full md:hidden z-50">
//     <div className="container mx-auto flex justify-around items-center">
//       <Link to="/" className="flex flex-col items-center text-muted-foreground hover:text-primary p-1">
//         <Home className="h-5 w-5" /> <span className="text-xs">Home</span>
//       </Link>
//       <Link to="/cart-checkout" className="flex flex-col items-center text-muted-foreground hover:text-primary p-1">
//         <ShoppingBag className="h-5 w-5" /> <span className="text-xs">Cart</span>
//       </Link>
//       <Link to="/user-profile" className="flex flex-col items-center text-primary p-1">
//         <User className="h-5 w-5" /> <span className="text-xs">Profile</span>
//       </Link>
//     </div>
//   </nav>
// );

// Simple placeholder for AppFooter if it's not provided elsewhere
// const AppFooter: React.FC = () => (
//  <footer className="py-6 px-4 text-center text-sm text-muted-foreground border-t mt-auto">
//    © {new Date().getFullYear()} Food Delivery Inc. All rights reserved.
//  </footer>
// );
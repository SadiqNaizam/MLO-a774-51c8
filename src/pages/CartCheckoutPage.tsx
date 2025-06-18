import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Custom Components
import AddressSelector, { Address } from '@/components/AddressSelector';

// Shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption, TableFooter as ShadTableFooter } from '@/components/ui/table';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from "@/components/ui/use-toast"; // Standard Toaster
import { toast as sonnerToast } from "sonner"; // Sonner for more dynamic notifications

// Lucide Icons
import { ChevronLeft, Trash2, Plus, Minus, Tag, CreditCard, MapPin, ShoppingBag, Building, CheckCircle } from 'lucide-react';

// Placeholder for AppHeader, AppFooter, MobileBottomNavigationBar
// In a real app, these would be imported from a layout or shared components directory
const AppHeader: React.FC = () => (
  <header className="bg-white shadow-sm sticky top-0 z-50 p-4 flex items-center justify-between">
    <Link to="/" className="flex items-center text-xl font-bold text-primary">
      <ShoppingBag className="mr-2 h-6 w-6" />
      FoodDeliv
    </Link>
    <div className="space-x-4">
        <Button variant="ghost" size="icon" asChild>
            <Link to="/user-profile"><MapPin className="h-5 w-5" /></Link>
        </Button>
    </div>
  </header>
);

const AppFooter: React.FC = () => (
  <footer className="bg-gray-100 dark:bg-gray-800 border-t py-8 text-center text-sm text-gray-600 dark:text-gray-400">
    <p>&copy; {new Date().getFullYear()} FoodDeliv. All rights reserved.</p>
    <div className="mt-2 space-x-4">
      <Link to="/about" className="hover:underline">About Us</Link>
      <Link to="/contact" className="hover:underline">Contact</Link>
      <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
    </div>
  </footer>
);

const MobileBottomNavigationBar: React.FC = () => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t shadow-t-md md:hidden z-50">
    <div className="flex justify-around items-center h-16">
      <Link to="/" className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
        <ShoppingBag className="h-6 w-6" />
        <span className="text-xs">Home</span>
      </Link>
      <Link to="/cart-checkout" className="flex flex-col items-center text-primary dark:text-primary">
        <CheckCircle className="h-6 w-6" />
        <span className="text-xs">Checkout</span>
      </Link>
      <Link to="/order-tracking" className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
        <MapPin className="h-6 w-6" />
        <span className="text-xs">Track</span>
      </Link>
      <Link to="/user-profile" className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
        <Building className="h-6 w-6" />
        <span className="text-xs">Profile</span>
      </Link>
    </div>
  </nav>
);


interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

const initialCartItems: CartItem[] = [
  { id: '1', name: 'Margherita Pizza', price: 12.99, quantity: 1, imageUrl: 'https://via.placeholder.com/100?text=Pizza' },
  { id: '2', name: 'Coca-Cola Can', price: 1.50, quantity: 2, imageUrl: 'https://via.placeholder.com/100?text=Coke' },
  { id: '3', name: 'Garlic Bread', price: 4.50, quantity: 1, imageUrl: 'https://via.placeholder.com/100?text=Garlic+Bread' },
];

const sampleAddresses: Address[] = [
  { id: 'addr1', label: 'Home', line1: '123 Main St', city: 'Anytown', state: 'CA', zip: '90210', isDefault: true },
  { id: 'addr2', label: 'Work', line1: '456 Office Ave', line2: 'Suite 100', city: 'Busytown', state: 'NY', zip: '10001' },
];

const addressSchema = z.object({
  label: z.string().optional(),
  line1: z.string().min(3, { message: "Street address must be at least 3 characters." }),
  line2: z.string().optional(),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  state: z.string().min(2, { message: "State must be at least 2 characters." }),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, { message: "Invalid ZIP code format." }),
});

const paymentDetailsSchema = z.object({
    cardNumber: z.string().length(16, "Card number must be 16 digits.").regex(/^\d+$/, "Card number must be digits only."),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be MM/YY format."),
    cvv: z.string().min(3).max(4).regex(/^\d+$/, "CVV must be 3 or 4 digits."),
    cardHolderName: z.string().min(2, "Cardholder name is required."),
});


const CartCheckoutPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(sampleAddresses.find(a => a.isDefault)?.id || null);
  const [addresses, setAddresses] = useState<Address[]>(sampleAddresses);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'cod' | 'paypal'>('credit-card');
  
  const navigate = useNavigate();
  const { toast: shadcnToaster } = useToast(); // for general toasts

  const addressForm = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: { label: '', line1: '', line2: '', city: '', state: '', zip: '' },
  });

  const paymentForm = useForm<z.infer<typeof paymentDetailsSchema>>({
    resolver: zodResolver(paymentDetailsSchema),
    defaultValues: { cardNumber: '', expiryDate: '', cvv: '', cardHolderName: '' },
  });

  useEffect(() => {
    console.log('CartCheckoutPage loaded');
    // Auto-select first address if none is default and addresses exist
    if (!selectedAddressId && addresses.length > 0) {
        setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    setCartItems(items =>
      items.map(item => (item.id === itemId ? { ...item, quantity: Math.max(1, newQuantity) } : item))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
    sonnerToast.error("Item removed from cart.");
  };

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(subtotal * 0.1);
      sonnerToast.success("Promo code applied: 10% off!");
    } else {
      setDiscount(0);
      sonnerToast.error("Invalid promo code.");
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 5.00 : 0; // Example delivery fee
  const total = subtotal - discount + deliveryFee;

  const onAddNewAddressSubmit = (values: z.infer<typeof addressSchema>) => {
    const newAddress: Address = {
      id: `addr${Date.now()}`,
      ...values,
    };
    setAddresses(prev => [...prev, newAddress]);
    setSelectedAddressId(newAddress.id);
    setShowNewAddressForm(false);
    addressForm.reset();
    sonnerToast.success("New address added successfully!");
  };

  const onPaymentSubmit = async () => { // Renamed from handlePlaceOrder to be more specific to payment form if used
    // Validate payment form if credit card is selected
    if (paymentMethod === 'credit-card') {
      const isValid = await paymentForm.trigger();
      if (!isValid) {
        sonnerToast.error("Please correct the errors in your payment details.");
        return;
      }
    }
    // Proceed with order placement logic
    handlePlaceOrder();
  };
  
  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      sonnerToast.error("Please select a delivery address.");
      return;
    }
    if (cartItems.length === 0) {
      sonnerToast.error("Your cart is empty.");
      return;
    }

    // Simulate API call for placing order
    console.log('Placing order with:', { cartItems, selectedAddressId, paymentMethod, total });
    sonnerToast.success("Order placed successfully! Redirecting to tracking...");
    // Clear cart or perform other cleanup actions
    setCartItems([]); 
    setTimeout(() => {
      navigate('/order-tracking'); // Path from App.tsx
    }, 1500);
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader />
      <Button variant="ghost" onClick={() => navigate(-1)} className="absolute top-4 left-4 mt-14 sm:mt-0 sm:top-6 sm:left-6 z-50 text-gray-600 hover:text-primary">
          <ChevronLeft className="mr-2 h-5 w-5" /> Back
      </Button>

      <ScrollArea className="flex-grow pt-16 md:pt-8 pb-24 md:pb-8"> {/* Padding for fixed navs */}
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Cart Items & Address */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Items Review */}
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Order</CardTitle>
                  <CardDescription>Check your items before proceeding.</CardDescription>
                </CardHeader>
                <CardContent>
                  {cartItems.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px] hidden sm:table-cell">Item</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead className="text-center">Quantity</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cartItems.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="hidden sm:table-cell">
                              <img src={item.imageUrl || 'https://via.placeholder.com/64'} alt={item.name} className="w-16 h-16 object-cover rounded" />
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground sm:hidden">${item.price.toFixed(2)} each</p>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                                <span>{item.quantity}</span>
                                <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right hidden sm:table-cell">${item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">Your cart is empty. <Link to="/" className="text-primary hover:underline">Continue shopping</Link>.</p>
                  )}
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <AddressSelector
                    savedAddresses={addresses}
                    selectedAddressId={selectedAddressId}
                    onSelectAddress={(id) => { setSelectedAddressId(id); setShowNewAddressForm(false); }}
                    onAddNewAddress={() => { setShowNewAddressForm(true); setSelectedAddressId(null); }}
                  />
                  {showNewAddressForm && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
                      <Form {...addressForm}>
                        <form onSubmit={addressForm.handleSubmit(onAddNewAddressSubmit)} className="space-y-4">
                          <FormField control={addressForm.control} name="label" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Label (e.g., Home, Work)</FormLabel>
                                <FormControl><Input placeholder="Home" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField control={addressForm.control} name="line1" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address Line 1</FormLabel>
                                <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField control={addressForm.control} name="line2" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address Line 2 (Optional)</FormLabel>
                                <FormControl><Input placeholder="Apartment, suite, etc." {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField control={addressForm.control} name="city" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <FormControl><Input placeholder="Anytown" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField control={addressForm.control} name="state" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>State</FormLabel>
                                  <FormControl><Input placeholder="CA" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField control={addressForm.control} name="zip" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>ZIP Code</FormLabel>
                                  <FormControl><Input placeholder="90210" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <Button type="submit" disabled={addressForm.formState.isSubmitting}>Save Address</Button>
                          <Button type="button" variant="outline" onClick={() => setShowNewAddressForm(false)} className="ml-2">Cancel</Button>
                        </form>
                      </Form>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Promo, Payment, Summary */}
            <div className="lg:col-span-1 space-y-6">
              {/* Promo Code */}
              <Card>
                <CardHeader>
                  <CardTitle>Promo Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      aria-label="Promo Code"
                    />
                    <Button onClick={handleApplyPromo} variant="outline">
                      <Tag className="mr-2 h-4 w-4" /> Apply
                    </Button>
                  </div>
                  {discount > 0 && <p className="text-sm text-green-600">Discount applied: -${discount.toFixed(2)}</p>}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)} className="space-y-2">
                    <Label htmlFor="credit-card" className="flex items-center space-x-2 p-3 border rounded-md cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <CreditCard className="h-5 w-5 mr-1" />
                      <span>Credit/Debit Card</span>
                    </Label>
                    <Label htmlFor="cod" className="flex items-center space-x-2 p-3 border rounded-md cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary">
                      <RadioGroupItem value="cod" id="cod" />
                      <ShoppingBag className="h-5 w-5 mr-1" />
                      <span>Cash on Delivery</span>
                    </Label>
                     <Label htmlFor="paypal" className="flex items-center space-x-2 p-3 border rounded-md cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <img src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" alt="PayPal" className="h-5"/>
                      <span>PayPal</span>
                    </Label>
                  </RadioGroup>

                  {paymentMethod === 'credit-card' && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="text-md font-semibold mb-4">Enter Card Details</h3>
                       <Form {...paymentForm}>
                        <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-4">
                             <FormField control={paymentForm.control} name="cardHolderName" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Cardholder Name</FormLabel>
                                <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={paymentForm.control} name="cardNumber" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Card Number</FormLabel>
                                <FormControl><Input placeholder="•••• •••• •••• ••••" {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={paymentForm.control} name="expiryDate" render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Expiry (MM/YY)</FormLabel>
                                    <FormControl><Input placeholder="MM/YY" {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={paymentForm.control} name="cvv" render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>CVV</FormLabel>
                                    <FormControl><Input placeholder="•••" {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            {/* Note: This submit button inside payment form is just for validation, actual order placement is via main button */}
                        </form>
                       </Form>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
                  <div className="flex justify-between"><span>Delivery Fee</span><span>${deliveryFee.toFixed(2)}</span></div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
                </CardContent>
                <CardFooter>
                  <Button size="lg" className="w-full" onClick={paymentMethod === 'credit-card' ? onPaymentSubmit : handlePlaceOrder} disabled={cartItems.length === 0 || !selectedAddressId}>
                    Place Order
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </ScrollArea>
      
      <AppFooter />
      <MobileBottomNavigationBar /> {/* Hidden on md and larger screens */}
    </div>
  );
};

export default CartCheckoutPage;
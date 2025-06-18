import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import CartCheckoutPage from "./pages/CartCheckoutPage";
import HomePage from "./pages/HomePage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import RestaurantPage from "./pages/RestaurantPage";
import UserProfilePage from "./pages/UserProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const App = () => (
<QueryClientProvider client={queryClient}>
    <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
        <Routes>


          <Route path="/" element={<HomePage />} />
          <Route path="/cart-checkout" element={<CartCheckoutPage />} />
          <Route path="/order-tracking" element={<OrderTrackingPage />} />
          <Route path="/restaurant" element={<RestaurantPage />} />
          <Route path="/user-profile" element={<UserProfilePage />} />
          {/* catch-all */}
          <Route path="*" element={<NotFound />} />


        </Routes>
    </BrowserRouter>
    </TooltipProvider>
</QueryClientProvider>
);

export default App;

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, Bike, Home, PackageCheck, Ban, Clock } from 'lucide-react';

interface OrderTrackerMapProps {
  orderId: string;
  restaurantName: string;
  userAddress: string;
  agentName?: string; // Agent might not be assigned yet
  currentOrderStatus: 'Processing' | 'Preparing' | 'Awaiting Rider' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
}

const OrderTrackerMap: React.FC<OrderTrackerMapProps> = ({
  orderId,
  restaurantName,
  userAddress,
  agentName,
  currentOrderStatus,
}) => {
  console.log('OrderTrackerMap loaded for order:', orderId);

  const getStatusVariant = (status: OrderTrackerMapProps['currentOrderStatus']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Processing':
      case 'Preparing':
      case 'Awaiting Rider':
        return "secondary";
      case 'Out for Delivery':
        return "default"; // Typically blue or a theme's primary
      case 'Delivered':
        return "default"; // Visually distinct, can be green if customized, otherwise primary
      case 'Cancelled':
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: OrderTrackerMapProps['currentOrderStatus']) => {
    switch (status) {
      case 'Processing':
      case 'Preparing':
      case 'Awaiting Rider':
        return <Clock className="h-4 w-4" />;
      case 'Out for Delivery':
        return <Bike className="h-4 w-4" />;
      case 'Delivered':
        return <PackageCheck className="h-4 w-4" />;
      case 'Cancelled':
        return <Ban className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const agentInfoText = () => {
    if (currentOrderStatus === 'Cancelled' || currentOrderStatus === 'Delivered') return null;

    if (!agentName) {
      if (currentOrderStatus === 'Awaiting Rider' || currentOrderStatus === 'Preparing' || currentOrderStatus === 'Processing') {
        return { title: "Searching for rider...", description: "We'll assign a delivery partner soon.", icon: <Clock className="h-6 w-6 mr-3 text-orange-500" /> };
      }
      return null;
    }
    
    let statusDescription = "";
    if (currentOrderStatus === 'Awaiting Rider') statusDescription = "Assigned. Will pick up shortly.";
    else if (currentOrderStatus === 'Out for Delivery') statusDescription = "On the way with your order!";
    else if (currentOrderStatus === 'Preparing') statusDescription = `Will pick up from ${restaurantName} once ready.`;
    
    return { title: agentName, description: statusDescription, icon: <Bike className={`h-6 w-6 mr-3 ${currentOrderStatus === 'Out for Delivery' ? 'text-blue-500' : 'text-gray-500'}`} /> };
  };

  const currentAgentInfo = agentInfoText();
  const showConceptualRoute = ['Awaiting Rider', 'Out for Delivery', 'Delivered'].includes(currentOrderStatus) && currentOrderStatus !== 'Cancelled';

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Order Tracking: #{orderId}</CardTitle>
        <CardDescription className="flex items-center pt-1">
          <Badge variant={getStatusVariant(currentOrderStatus)} className="text-sm px-3 py-1">
            <span className="mr-2">{getStatusIcon(currentOrderStatus)}</span>
            {currentOrderStatus}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 sm:p-6 rounded-lg min-h-[300px] md:min-h-[350px] flex flex-col justify-between items-center text-center">
          <div> {/* Top section for info cards */}
            <p className="text-xs text-muted-foreground mb-4">
              (Live map visualization will appear here in a future update)
            </p>
            
            <div className="space-y-3 w-full max-w-sm mx-auto">
              {/* Restaurant */}
              <div className="flex items-center p-3 bg-white dark:bg-slate-700/50 rounded-lg shadow-sm border dark:border-slate-700">
                <Store className="h-6 w-6 mr-3 text-primary flex-shrink-0" />
                <div className="text-left">
                  <p className="font-semibold text-sm">{restaurantName}</p>
                  <p className="text-xs text-muted-foreground">Restaurant</p>
                </div>
              </div>

              {/* Agent (if applicable) */}
              {currentAgentInfo && (
                <div className="flex items-center p-3 bg-white dark:bg-slate-700/50 rounded-lg shadow-sm border dark:border-slate-700">
                  {currentAgentInfo.icon}
                  <div className="text-left">
                    <p className="font-semibold text-sm">{currentAgentInfo.title}</p>
                    {currentAgentInfo.description && <p className="text-xs text-muted-foreground">{currentAgentInfo.description}</p>}
                  </div>
                </div>
              )}

              {/* User Destination */}
              {currentOrderStatus !== 'Cancelled' && (
                <div className="flex items-center p-3 bg-white dark:bg-slate-700/50 rounded-lg shadow-sm border dark:border-slate-700">
                  <Home className="h-6 w-6 mr-3 text-green-600 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-semibold text-sm">Your Location</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-xs">{userAddress}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Conceptual Route Visualization (Bottom section) */}
          {showConceptualRoute && (
            <div className="mt-6 w-full max-w-sm mx-auto">
              <div className="flex items-center justify-between text-muted-foreground">
                  <div className="flex flex-col items-center text-center w-1/3">
                      <Store className={`h-5 w-5 mb-1 ${currentOrderStatus !== 'Delivered' ? 'text-primary' : 'text-gray-400'}`} />
                      <span className="text-xs block truncate w-full">{restaurantName}</span>
                  </div>
                  
                  <div className="flex-grow border-t-2 border-dashed border-gray-300 dark:border-gray-600 mx-2 h-0.5"></div>
                  
                  {agentName && (currentOrderStatus === 'Out for Delivery' || currentOrderStatus === 'Awaiting Rider' || currentOrderStatus === 'Delivered') ? (
                    <>
                      <div className="flex flex-col items-center text-center w-1/3">
                          <Bike className={`h-5 w-5 mb-1 ${currentOrderStatus === 'Out for Delivery' ? 'text-blue-500 animate-pulse' : (currentOrderStatus === 'Delivered' ? 'text-gray-400' : 'text-gray-500')}`} />
                          <span className="text-xs block truncate w-full">{agentName}</span>
                      </div>
                      <div className="flex-grow border-t-2 border-dashed border-gray-300 dark:border-gray-600 mx-2 h-0.5"></div>
                    </>
                  ) : ( // Placeholder if no agent yet but route is shown (e.g. Awaiting Rider, not yet assigned)
                    currentOrderStatus === 'Awaiting Rider' && !agentName && (
                        <>
                         <div className="flex flex-col items-center text-center w-1/3">
                            <Clock className="h-5 w-5 mb-1 text-orange-500" />
                            <span className="text-xs block truncate w-full">Assigning</span>
                         </div>
                         <div className="flex-grow border-t-2 border-dashed border-gray-300 dark:border-gray-600 mx-2 h-0.5"></div>
                        </>
                    )
                  )}
                  
                  <div className="flex flex-col items-center text-center w-1/3">
                      <Home className={`h-5 w-5 mb-1 ${currentOrderStatus === 'Delivered' ? 'text-green-600' : 'text-gray-500'}`} />
                      <span className="text-xs block truncate w-full">You</span>
                  </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTrackerMap;
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Home, Briefcase, MapPin } from 'lucide-react';

export interface Address {
  id: string;
  label?: string; // "Home", "Work", "Other"
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string; 
  isDefault?: boolean;
}

interface AddressSelectorProps {
  savedAddresses: Address[];
  selectedAddressId?: string | null;
  onSelectAddress: (addressId: string) => void;
  onAddNewAddress: () => void;
  isLoading?: boolean;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  savedAddresses,
  selectedAddressId,
  onSelectAddress,
  onAddNewAddress,
  isLoading = false,
}) => {
  console.log('AddressSelector loaded');

  const getAddressIcon = (label?: string) => {
    switch (label?.toLowerCase()) {
      case 'home':
        return <Home className="mr-2 h-5 w-5 text-muted-foreground" />;
      case 'work':
        return <Briefcase className="mr-2 h-5 w-5 text-muted-foreground" />;
      default:
        return <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Loading Addresses...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 border rounded-md">
                <div className="h-5 w-5 mt-1 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
          <Separator className="my-6" />
           <Button className="w-full bg-gray-300 animate-pulse" disabled>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Address
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Select Delivery Address</CardTitle>
        <CardDescription>Choose from your saved addresses or add a new one.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {savedAddresses.length > 0 ? (
          <ScrollArea className="h-auto max-h-[300px] pr-3"> {/* Max height for scrollability */}
            <RadioGroup
              value={selectedAddressId || undefined} // RadioGroup value cannot be null
              onValueChange={onSelectAddress}
              className="space-y-3"
            >
              {savedAddresses.map((address) => (
                <Label
                  key={address.id}
                  htmlFor={`address-${address.id}`}
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all hover:border-primary focus-within:ring-2 focus-within:ring-primary ${
                    selectedAddressId === address.id ? 'border-primary ring-2 ring-primary' : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <RadioGroupItem value={address.id} id={`address-${address.id}`} className="mr-3 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                            {getAddressIcon(address.label)}
                            <span className="font-semibold text-sm md:text-md">{address.label || 'Address'}</span>
                        </div>
                      {address.isDefault && (
                        <Badge variant="outline" className="ml-2 text-xs h-fit">Default</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-0.5">
                        <p>{address.line1}</p>
                        {address.line2 && <p>{address.line2}</p>}
                        <p>{`${address.city}, ${address.state} ${address.zip}`}</p>
                        {address.country && <p>{address.country}</p>}
                    </div>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 border border-dashed rounded-lg">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-md font-medium text-gray-700 dark:text-gray-300">No saved addresses found.</p>
            <p className="text-sm text-muted-foreground">Add a new address to get started.</p>
          </div>
        )}
        <Separator />
        <Button onClick={onAddNewAddress} className="w-full" variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Address
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddressSelector;
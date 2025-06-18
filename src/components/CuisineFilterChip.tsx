import React from 'react';
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

interface CuisineFilterChipProps {
  cuisineName: string;
  isSelected: boolean;
  onToggle: (cuisineName: string) => void;
  className?: string;
}

const CuisineFilterChip: React.FC<CuisineFilterChipProps> = ({
  cuisineName,
  isSelected,
  onToggle,
  className,
}) => {
  console.log(`CuisineFilterChip loaded for: ${cuisineName}, selected: ${isSelected}`);

  const handlePress = () => {
    onToggle(cuisineName);
  };

  return (
    <Toggle
      pressed={isSelected}
      onPressedChange={handlePress}
      aria-label={`Filter by ${cuisineName}`}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "border border-input",
        isSelected
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground", // Explicitly for Toggle component
        "data-[state=off]:bg-transparent data-[state=off]:text-foreground", // Explicitly for Toggle component
        className
      )}
    >
      {cuisineName}
    </Toggle>
  );
};

export default CuisineFilterChip;
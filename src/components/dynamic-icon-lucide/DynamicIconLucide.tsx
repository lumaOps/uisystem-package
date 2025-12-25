import React from 'react';
import * as LucideIcons from 'lucide-react'; // Import all Lucide icons

// Define types for the icon components
type LucideIconProps = {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
  [key: string]: unknown;
};

// Type for our DynamicIcon component props
interface DynamicIconProps extends LucideIconProps {
  iconName: string;
}

// Component that renders a Lucide icon from a string name
const DynamicIconLucide: React.FC<DynamicIconProps> = ({ iconName, ...props }) => {
  // Check if the icon exists in Lucide icons
  const IconComponent = (
    LucideIcons as unknown as Record<string, React.ComponentType<LucideIconProps>>
  )[iconName];

  if (IconComponent) {
    return <IconComponent {...props} />;
  }

  // Fallback if icon not found
  console.warn(`Icon "${iconName}" not found in Lucide icons`);
  return null;
};

export default DynamicIconLucide;

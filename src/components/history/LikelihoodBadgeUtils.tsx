
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

export const getLikelihoodBadge = (likelihood: 'high' | 'medium' | 'low' | 'unknown') => {
  // Default to unknown if likelihood is undefined or invalid
  const safeValue = likelihood && ['high', 'medium', 'low'].includes(likelihood) 
    ? likelihood 
    : 'unknown';
    
  const badgeStyles = {
    high: { bg: 'bg-red-500', icon: <AlertCircle className="h-4 w-4 mr-1" /> },
    medium: { bg: 'bg-amber-500', icon: <HelpCircle className="h-4 w-4 mr-1" /> },
    low: { bg: 'bg-green-500', icon: <CheckCircle className="h-4 w-4 mr-1" /> },
    unknown: { bg: 'bg-blue-500', icon: <HelpCircle className="h-4 w-4 mr-1" /> }
  };

  const { bg, icon } = badgeStyles[safeValue];
  return (
    <Badge className={`${bg} flex items-center`}>
      {icon}
      {safeValue === 'high' ? 'High' : safeValue === 'medium' ? 'Medium' : safeValue === 'low' ? 'Low' : 'Unknown'} Likelihood
    </Badge>
  );
};

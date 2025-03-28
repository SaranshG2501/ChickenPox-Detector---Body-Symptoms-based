
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

export const getLikelihoodBadge = (likelihood: 'high' | 'medium' | 'low' | 'unknown') => {
  const badgeStyles = {
    high: { bg: 'bg-red-500', icon: <AlertCircle className="h-4 w-4 mr-1" /> },
    medium: { bg: 'bg-amber-500', icon: <HelpCircle className="h-4 w-4 mr-1" /> },
    low: { bg: 'bg-green-500', icon: <CheckCircle className="h-4 w-4 mr-1" /> },
    unknown: { bg: 'bg-blue-500', icon: <HelpCircle className="h-4 w-4 mr-1" /> }
  };

  const { bg, icon } = badgeStyles[likelihood];
  return (
    <Badge className={`${bg} flex items-center`}>
      {icon}
      {likelihood === 'high' ? 'High' : likelihood === 'medium' ? 'Medium' : likelihood === 'low' ? 'Low' : 'Unknown'} Likelihood
    </Badge>
  );
};

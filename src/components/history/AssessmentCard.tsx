
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  CheckCircle, 
  HelpCircle, 
  CalendarIcon, 
  Clock, 
  Eye 
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export interface AssessmentRecord {
  id: string;
  questionnaire: any;
  analysis: {
    likelihood: 'high' | 'medium' | 'low' | 'unknown';
    score: number;
    reasons: string[];
    advice: string;
  };
  imageUrl: string | null;
  assessmentDate: string;
  createdAt: any;
}

interface AssessmentCardProps {
  assessment: AssessmentRecord;
  onViewDetails: (id: string) => void;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
  getLikelihoodBadge: (likelihood: 'high' | 'medium' | 'low' | 'unknown') => React.ReactNode;
}

const AssessmentCard = ({ 
  assessment, 
  onViewDetails,
  formatDate,
  formatTime,
  getLikelihoodBadge
}: AssessmentCardProps) => {
  const isMobile = useIsMobile();
  console.log('Rendering AssessmentCard with data:', assessment);
  console.log('Is mobile view:', isMobile);
  
  // Handle potentially missing data with defaults
  const {
    id = '',
    analysis = { likelihood: 'unknown', score: 0, reasons: [], advice: '' },
    imageUrl = null,
    assessmentDate = new Date().toISOString(),
  } = assessment;
  
  // Ensure reasons is an array
  const reasons = Array.isArray(analysis.reasons) ? analysis.reasons : [];

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px] h-full flex flex-col">
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex justify-between items-start flex-wrap gap-1 sm:gap-2">
          <div>
            <CardTitle className="text-sm sm:text-base">Assessment Report</CardTitle>
            <CardDescription className="flex flex-wrap items-center mt-0.5 sm:mt-1 gap-0.5 sm:gap-1 text-xs">
              <CalendarIcon className="h-3 w-3" />
              {formatDate(assessmentDate)}
              <span className="mx-0.5 sm:mx-1">•</span>
              <Clock className="h-3 w-3" />
              {formatTime(assessmentDate)}
            </CardDescription>
          </div>
          {getLikelihoodBadge(analysis.likelihood)}
        </div>
      </CardHeader>
      <CardContent className="pb-2 sm:pb-4 flex-grow">
        <div className="flex gap-2 sm:gap-4">
          {imageUrl && (
            <div className="shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded overflow-hidden border">
              <img 
                src={imageUrl} 
                alt="Skin condition" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h4 className="font-medium mb-0.5 sm:mb-1 text-xs sm:text-sm">Key Factors:</h4>
            <ul className="list-disc pl-4 sm:pl-5 text-xs space-y-0.5">
              {reasons.length > 0 ? (
                <>
                  {reasons.slice(0, 2).map((reason, idx) => (
                    <li key={idx} className="line-clamp-2 text-[11px] sm:text-xs">{reason}</li>
                  ))}
                  {reasons.length > 2 && (
                    <li className="text-gray-500 text-[10px] sm:text-xs">+ {reasons.length - 2} more factors</li>
                  )}
                </>
              ) : (
                <li className="text-[11px] sm:text-xs">No specific factors recorded</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 justify-end mt-auto pt-2 pb-2 sm:py-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-[11px] sm:text-xs w-full sm:w-auto flex justify-center items-center h-7 sm:h-8" 
          onClick={() => onViewDetails(id)}
        >
          <Eye className="h-3 w-3 mr-1" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AssessmentCard;

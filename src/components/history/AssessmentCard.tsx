
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
  console.log('Rendering AssessmentCard with data:', assessment);
  
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
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <CardTitle className="text-base sm:text-lg">Assessment Report</CardTitle>
            <CardDescription className="flex flex-wrap items-center mt-1 gap-1 text-xs sm:text-sm">
              <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              {formatDate(assessmentDate)}
              <span className="mx-1">•</span>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              {formatTime(assessmentDate)}
            </CardDescription>
          </div>
          {getLikelihoodBadge(analysis.likelihood)}
        </div>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <div className="flex gap-3 sm:gap-4">
          {imageUrl && (
            <div className="shrink-0 w-16 h-16 sm:w-24 sm:h-24 rounded overflow-hidden border">
              <img 
                src={imageUrl} 
                alt="Skin condition" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h4 className="font-medium mb-1 text-sm sm:text-base">Key Factors:</h4>
            <ul className="list-disc pl-5 text-xs sm:text-sm space-y-0.5">
              {reasons.length > 0 ? (
                <>
                  {reasons.slice(0, 2).map((reason, idx) => (
                    <li key={idx} className="line-clamp-2">{reason}</li>
                  ))}
                  {reasons.length > 2 && (
                    <li className="text-gray-500">+ {reasons.length - 2} more factors</li>
                  )}
                </>
              ) : (
                <li>No specific factors recorded</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 justify-end mt-auto pt-3 pb-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs sm:text-sm w-full sm:w-auto flex justify-center items-center" 
          onClick={() => onViewDetails(id)}
        >
          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AssessmentCard;

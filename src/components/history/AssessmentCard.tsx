
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
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Assessment Report</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {formatDate(assessment.assessmentDate)}
              <span className="mx-1">•</span>
              <Clock className="h-4 w-4 mr-1" />
              {formatTime(assessment.assessmentDate)}
            </CardDescription>
          </div>
          {getLikelihoodBadge(assessment.analysis.likelihood)}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex gap-4">
          {assessment.imageUrl && (
            <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded overflow-hidden border">
              <img 
                src={assessment.imageUrl} 
                alt="Skin condition" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h4 className="font-medium mb-1">Key Factors:</h4>
            <ul className="list-disc pl-5 text-sm space-y-0.5">
              {assessment.analysis.reasons.slice(0, 3).map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
              {assessment.analysis.reasons.length > 3 && (
                <li className="text-gray-500">+ {assessment.analysis.reasons.length - 3} more factors</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onViewDetails(assessment.id)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AssessmentCard;

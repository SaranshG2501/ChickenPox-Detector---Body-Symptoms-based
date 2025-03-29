
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, HelpCircle, Printer, Activity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AssessmentResultCardProps {
  likelihood: 'high' | 'medium' | 'low' | 'unknown';
  score: number;
  reasons: string[];
  advice: string;
  imageUrl: string | null;
  assessmentDate: string;
  formattedDate: string;
  onPrint: () => void;
  aiConfidence?: number;
  alternativeDiagnoses?: string[];
}

export const AssessmentResultCard = ({
  likelihood,
  reasons,
  advice,
  imageUrl,
  formattedDate,
  onPrint,
  aiConfidence,
  alternativeDiagnoses
}: AssessmentResultCardProps) => {
  const getLikelihoodInfo = (likelihood: 'high' | 'medium' | 'low' | 'unknown') => {
    const styles = {
      high: { 
        bg: 'bg-red-50 border-red-200', 
        badge: 'bg-red-500',
        icon: <AlertCircle className="h-8 w-8 text-red-500" />,
        title: "High Likelihood of Chicken Pox"
      },
      medium: { 
        bg: 'bg-amber-50 border-amber-200', 
        badge: 'bg-amber-500',
        icon: <HelpCircle className="h-8 w-8 text-amber-500" />,
        title: "Possible Chicken Pox"
      },
      low: { 
        bg: 'bg-green-50 border-green-200', 
        badge: 'bg-green-500',
        icon: <CheckCircle className="h-8 w-8 text-green-500" />,
        title: "Low Likelihood of Chicken Pox"
      },
      unknown: { 
        bg: 'bg-blue-50 border-blue-200', 
        badge: 'bg-blue-500',
        icon: <HelpCircle className="h-8 w-8 text-blue-500" />,
        title: "Uncertain Assessment"
      }
    };

    return styles[likelihood];
  };

  const { bg, badge, icon, title } = getLikelihoodInfo(likelihood);

  return (
    <Card className={`w-full border-2 mb-6 ${bg}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {icon}
            <CardTitle className="ml-2 text-xl">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {aiConfidence !== undefined && (
              <Badge className="bg-blue-500 flex items-center gap-1">
                <Activity className="h-3 w-3" />
                AI: {aiConfidence.toFixed(1)}%
              </Badge>
            )}
            <Badge className={badge}>
              {likelihood === 'high' 
                ? 'High' 
                : likelihood === 'medium'
                ? 'Medium'
                : likelihood === 'low'
                ? 'Low'
                : 'Unknown'} Likelihood
            </Badge>
          </div>
        </div>
        <CardDescription className="mt-2 flex items-center">
          <span className="inline-flex items-center">
            <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          Assessment Date: {formattedDate}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          {aiConfidence !== undefined && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16H12.01M12 8V12M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                AI Analysis Results
              </h3>
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Chickenpox confidence:</span>
                  <span className="text-sm font-semibold">{aiConfidence.toFixed(1)}%</span>
                </div>
                <Progress value={aiConfidence} className="h-2" />
              </div>
              
              {alternativeDiagnoses && alternativeDiagnoses.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-1">Other conditions detected:</p>
                  <ul className="text-sm list-disc pl-5">
                    {alternativeDiagnoses.map((condition, index) => (
                      <li key={index}>{condition}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                *AI analysis is based on the uploaded image and should be interpreted by a healthcare professional.
              </p>
            </div>
          )}
          
          <div>
            <h3 className="font-medium mb-2">Key Factors:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {reasons.map((reason: string, index: number) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Recommendation:</h3>
            <p className="text-sm">{advice}</p>
          </div>
          
          {imageUrl && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Uploaded Image:</h3>
              <div className="relative border rounded-md overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt="Skin condition" 
                  className="w-full max-h-60 object-contain" 
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t p-4 print:hidden">
        <div className="flex gap-2">
          <Button variant="outline" onClick={onPrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};


import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, HelpCircle, Printer } from 'lucide-react';

interface AssessmentResultCardProps {
  likelihood: 'high' | 'medium' | 'low' | 'unknown';
  score: number;
  reasons: string[];
  advice: string;
  imageUrl: string | null;
  assessmentDate: string;
  formattedDate: string;
  onPrint: () => void;
}

export const AssessmentResultCard = ({
  likelihood,
  reasons,
  advice,
  imageUrl,
  formattedDate,
  onPrint
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

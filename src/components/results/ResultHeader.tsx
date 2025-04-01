
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, HelpCircle, Activity } from 'lucide-react';
import { AnalysisResult } from "./AnalysisResult";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResultHeaderProps {
  result: AnalysisResult;
}

const ResultHeader = ({ result }: ResultHeaderProps) => {
  const isMobile = useIsMobile();

  const resultDisplay = {
    high: {
      icon: <AlertCircle className={`${isMobile ? 'h-5 w-5' : 'h-8 w-8'} text-red-500`} />,
      title: isMobile ? "High Likelihood" : "High Likelihood of Chicken Pox",
      color: "bg-red-50 border-red-200",
      badge: <Badge className="bg-red-500 text-[10px] sm:text-xs">High Likelihood</Badge>
    },
    medium: {
      icon: <HelpCircle className={`${isMobile ? 'h-5 w-5' : 'h-8 w-8'} text-amber-500`} />,
      title: isMobile ? "Possible Chicken Pox" : "Possible Chicken Pox",
      color: "bg-amber-50 border-amber-200",
      badge: <Badge className="bg-amber-500 text-[10px] sm:text-xs">Medium Likelihood</Badge>
    },
    low: {
      icon: <CheckCircle className={`${isMobile ? 'h-5 w-5' : 'h-8 w-8'} text-green-500`} />,
      title: isMobile ? "Low Likelihood" : "Low Likelihood of Chicken Pox",
      color: "bg-green-50 border-green-200",
      badge: <Badge className="bg-green-500 text-[10px] sm:text-xs">Low Likelihood</Badge>
    },
    unknown: {
      icon: <HelpCircle className={`${isMobile ? 'h-5 w-5' : 'h-8 w-8'} text-blue-500`} />,
      title: isMobile ? "Uncertain Assessment" : "Uncertain Assessment",
      color: "bg-blue-50 border-blue-200",
      badge: <Badge className="bg-blue-500 text-[10px] sm:text-xs">Uncertain</Badge>
    }
  };
  
  const current = resultDisplay[result.likelihood];
  
  return (
    <CardHeader className="pb-1 sm:pb-2">
      <div className="flex justify-between items-center flex-wrap gap-1">
        <div className="flex items-center">
          {current.icon}
          <CardTitle className="ml-1 sm:ml-2 text-base sm:text-xl">{current.title}</CardTitle>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {result.aiConfidence !== undefined && (
            <Badge className="bg-blue-500 flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs">
              <Activity className="h-2 w-2 sm:h-3 sm:w-3" />
              AI: {result.aiConfidence.toFixed(1)}%
            </Badge>
          )}
          {current.badge}
        </div>
      </div>
      <CardDescription className="mt-1 sm:mt-2 text-[10px] sm:text-sm">
        This assessment is based on your symptom information and AI analysis of the uploaded image.
      </CardDescription>
    </CardHeader>
  );
};

export default ResultHeader;

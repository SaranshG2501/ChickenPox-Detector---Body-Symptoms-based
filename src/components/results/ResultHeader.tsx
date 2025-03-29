
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, HelpCircle, Activity } from 'lucide-react';
import { AnalysisResult } from "./AnalysisResult";

interface ResultHeaderProps {
  result: AnalysisResult;
}

const ResultHeader = ({ result }: ResultHeaderProps) => {
  const resultDisplay = {
    high: {
      icon: <AlertCircle className="h-8 w-8 text-red-500" />,
      title: "High Likelihood of Chicken Pox",
      color: "bg-red-50 border-red-200",
      badge: <Badge className="bg-red-500">High Likelihood</Badge>
    },
    medium: {
      icon: <HelpCircle className="h-8 w-8 text-amber-500" />,
      title: "Possible Chicken Pox",
      color: "bg-amber-50 border-amber-200",
      badge: <Badge className="bg-amber-500">Medium Likelihood</Badge>
    },
    low: {
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      title: "Low Likelihood of Chicken Pox",
      color: "bg-green-50 border-green-200",
      badge: <Badge className="bg-green-500">Low Likelihood</Badge>
    },
    unknown: {
      icon: <HelpCircle className="h-8 w-8 text-blue-500" />,
      title: "Uncertain Assessment",
      color: "bg-blue-50 border-blue-200",
      badge: <Badge className="bg-blue-500">Uncertain</Badge>
    }
  };
  
  const current = resultDisplay[result.likelihood];
  
  return (
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {current.icon}
          <CardTitle className="ml-2 text-xl">{current.title}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {result.aiConfidence !== undefined && (
            <Badge className="bg-blue-500 flex items-center gap-1">
              <Activity className="h-3 w-3" />
              AI: {result.aiConfidence.toFixed(1)}%
            </Badge>
          )}
          {current.badge}
        </div>
      </div>
      <CardDescription className="mt-2">
        This assessment is based on your symptom information and AI analysis of the uploaded image.
      </CardDescription>
    </CardHeader>
  );
};

export default ResultHeader;

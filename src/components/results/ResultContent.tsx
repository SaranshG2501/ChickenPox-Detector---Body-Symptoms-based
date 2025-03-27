
import { CardContent } from "@/components/ui/card";
import { AnalysisResult } from "./AnalysisResult";

interface ResultContentProps {
  result: AnalysisResult;
  imagePreview: string | null;
}

const ResultContent = ({ result, imagePreview }: ResultContentProps) => {
  return (
    <CardContent className="pb-2">
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Key Factors:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {result.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Recommendation:</h3>
          <p className="text-sm">{result.advice}</p>
        </div>
        
        {imagePreview && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Uploaded Image:</h3>
            <div className="relative border rounded-md overflow-hidden">
              <img 
                src={imagePreview} 
                alt="Uploaded skin condition" 
                className="w-full max-h-60 object-contain" 
              />
            </div>
          </div>
        )}
      </div>
    </CardContent>
  );
};

export default ResultContent;


import { CardContent } from "@/components/ui/card";
import { AnalysisResult } from "./AnalysisResult";
import { RoboflowResponse } from "../../services/roboflowService";
import { Progress } from "@/components/ui/progress";

interface ResultContentProps {
  result: AnalysisResult;
  imagePreview: string | null;
  imageAnalysisResults?: RoboflowResponse | null;
}

const ResultContent = ({ result, imagePreview, imageAnalysisResults }: ResultContentProps) => {
  return (
    <CardContent className="pb-2">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16H12.01M12 8V12M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Image Analysis Results
            </h3>
            {result.aiConfidence !== undefined ? (
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Chickenpox confidence:</span>
                  <span className="text-sm font-semibold">{result.aiConfidence.toFixed(1)}%</span>
                </div>
                <Progress value={result.aiConfidence} className="h-2" />
              </div>
            ) : imagePreview ? (
              <p className="text-sm text-gray-700">
                No specific chickenpox patterns were detected in the image.
              </p>
            ) : (
              <p className="text-sm text-gray-700">
                No image was provided for analysis.
              </p>
            )}
            
            {imageAnalysisResults && imageAnalysisResults.predictions && (
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-1">AI Detection Details:</h4>
                {imageAnalysisResults.predictions.length > 0 ? (
                  <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                    {imageAnalysisResults.predictions.map((pred, idx) => (
                      <li key={idx}>
                        {pred.class}: {(pred.confidence * 100).toFixed(1)}% confidence
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-600">No specific patterns were detected in the image.</p>
                )}
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              *AI analysis is based on the uploaded image.
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Possible Conditions
            </h3>
            
            {result.alternativeDiagnoses && result.alternativeDiagnoses.length > 0 ? (
              <div>
                <p className="text-sm font-medium mb-1">Other possible conditions:</p>
                <ul className="text-sm list-disc pl-5">
                  {result.alternativeDiagnoses.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm">
                {imagePreview 
                  ? "No alternative conditions were detected in your image."
                  : "No image was provided for alternative condition analysis."}
              </p>
            )}
            
            <div className="mt-3">
              <p className="text-sm font-medium mb-1">Assessment based on:</p>
              <ul className="text-sm list-disc pl-5">
                <li>Symptom questionnaire</li>
                {imagePreview && <li>Image analysis</li>}
                {result.aiConfidence !== undefined && <li>AI model detection ({result.aiConfidence.toFixed(1)}% confidence)</li>}
              </ul>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              *These predictions should be interpreted by a healthcare professional.
            </p>
          </div>
        </div>
        
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
              
              {imageAnalysisResults && imageAnalysisResults.predictions && imageAnalysisResults.predictions.length > 0 && (
                <div className="absolute inset-0">
                  {imageAnalysisResults.predictions.map((pred, idx) => {
                    if (pred.x && pred.y && pred.width && pred.height) {
                      const style = {
                        left: `${(pred.x - pred.width/2) * 100}%`,
                        top: `${(pred.y - pred.height/2) * 100}%`,
                        width: `${pred.width * 100}%`,
                        height: `${pred.height * 100}%`,
                        borderColor: pred.class.toLowerCase().includes('chicken') || pred.class.toLowerCase().includes('pox') 
                          ? '#ef4444' : '#3b82f6'
                      };
                      
                      return (
                        <div 
                          key={idx}
                          className="absolute border-2 rounded-sm flex items-start justify-start"
                          style={style}
                        >
                          <span 
                            className="text-xs font-bold px-1 inline-flex items-center"
                            style={{
                              backgroundColor: pred.class.toLowerCase().includes('chicken') || pred.class.toLowerCase().includes('pox') 
                                ? '#ef4444' : '#3b82f6',
                              color: 'white',
                              transform: 'translateY(-100%)'
                            }}
                          >
                            {pred.class} ({(pred.confidence * 100).toFixed(1)}%)
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </CardContent>
  );
};

export default ResultContent;

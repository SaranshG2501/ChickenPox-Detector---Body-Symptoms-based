
import { Card } from "@/components/ui/card";
import { QuestionnaireResults } from './SymptomsQuestionnaire';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";
import { analyzeResults } from './results/ResultAnalyzer';
import ResultHeader from './results/ResultHeader';
import ResultContent from './results/ResultContent';
import ResultActions from './results/ResultActions';
import DisclaimerComponent from './results/DisclaimerComponent';
import { handleSaveAssessment } from './results/SaveResultHandler';
import { analyzeImageWithRoboflow, RoboflowResponse } from '../services/roboflowService';
import { Check, AlertCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResultDisplayProps {
  results: QuestionnaireResults;
  imagePreview: string | null;
  imageFile: File | null;
  onRestart: () => void;
}

const ResultDisplay = ({ results, imagePreview, imageFile, onRestart }: ResultDisplayProps) => {
  const { currentUser } = useAuth();
  const isMobile = useIsMobile();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [imageAnalysisResults, setImageAnalysisResults] = useState<RoboflowResponse | null>(null);
  const [analyzeError, setAnalyzeError] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    const analyzeImage = async () => {
      if (!imagePreview) {
        setIsAnalyzing(false);
        return;
      }
      
      try {
        setIsAnalyzing(true);
        setImageLoaded(false);
        setAnalyzeError(false);
        
        // First show a message that image is being processed
        toast.info("Processing your image...");
        
        // Analyze image with Roboflow API
        const analysis = await analyzeImageWithRoboflow(imagePreview);
        setImageAnalysisResults(analysis);
        
        // Check if we got an error response (API failure)
        if (analysis.inference_id === "error") {
          setAnalyzeError(true);
          console.log("API error detected, using symptom-based assessment only");
        } else {
          setImageLoaded(true);
          toast.success("Image analysis complete!");
          console.log("Image analysis complete:", analysis);
        }
      } catch (error) {
        console.error("Error analyzing image:", error);
        setAnalyzeError(true);
      } finally {
        setIsAnalyzing(false);
      }
    };
    
    analyzeImage();
  }, [imagePreview]);
  
  const result = analyzeResults(results, imageAnalysisResults || undefined);
  
  const saveResult = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to save assessments");
      return;
    }

    setIsSaving(true);
    try {
      const saveSuccessful = await handleSaveAssessment({
        currentUserId: currentUser.uid,
        imageFile,
        results,
        analysisResult: result,
        imageAnalysisResults,
        onSuccess: () => setIsSaved(true)
      });
      
      if (!saveSuccessful) {
        setIsSaving(false);
      }
    } catch (error) {
      setIsSaving(false);
      console.error("Error in save operation:", error);
      toast.error("Unable to save the result. Please try again.");
    }
  };
  
  return (
    <div className="animate-slide-up">
      {isAnalyzing ? (
        <Card className="w-full p-3 sm:p-6 border-2 mb-3 sm:mb-6 bg-white shadow-md">
          <div className="flex flex-col items-center justify-center py-4 sm:py-8">
            <div className="w-10 h-10 sm:w-16 sm:h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-3 sm:mb-4"></div>
            <h3 className="text-base sm:text-xl font-medium text-gray-800 mb-1 sm:mb-2">Analyzing your image...</h3>
            <p className="text-xs sm:text-base text-gray-600 text-center px-2">
              Our AI model is examining your uploaded image for signs of chickenpox.
              This may take a few moments.
            </p>
          </div>
        </Card>
      ) : (
        <Card className={`w-full border-2 mb-3 sm:mb-6 shadow-md ${result ? `bg-${result.likelihood === 'high' ? 'red' : result.likelihood === 'medium' ? 'amber' : result.likelihood === 'low' ? 'green' : 'blue'}-50 border-${result.likelihood === 'high' ? 'red' : result.likelihood === 'medium' ? 'amber' : result.likelihood === 'low' ? 'green' : 'blue'}-200` : ''}`}>
          {imageLoaded && imagePreview && !analyzeError && (
            <div className="flex justify-center items-center py-2 px-3 mx-auto mb-2 sm:mb-3 bg-gray-100 border border-gray-200 rounded-md">
              <div className="flex items-center text-sm sm:text-base gap-1 sm:gap-2">
                <div className="bg-gray-200 rounded-full p-0.5 sm:p-1 flex items-center justify-center">
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-gray-700" />
                </div>
                <p className="text-xs sm:text-sm text-gray-800 font-medium">
                  Image successfully analyzed
                </p>
              </div>
            </div>
          )}
          
          {analyzeError && imagePreview && (
            <div className="flex justify-center items-center py-2 px-3 mx-auto mb-2 sm:mb-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center text-sm sm:text-base gap-1 sm:gap-2">
                <div className="bg-red-100 rounded-full p-0.5 sm:p-1 flex items-center justify-center">
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                </div>
                <p className="text-xs sm:text-sm text-red-800 font-medium">
                  Image analysis failed. Using symptoms only.
                </p>
              </div>
            </div>
          )}
          
          <ResultHeader result={result} />
          <ResultContent 
            result={result} 
            imagePreview={imagePreview} 
            imageAnalysisResults={imageAnalysisResults}
            analyzeError={analyzeError}
          />
          <ResultActions 
            onRestart={onRestart} 
            onSave={saveResult}
            isSaving={isSaving}
            isSaved={isSaved}
          />
        </Card>
      )}
      
      <DisclaimerComponent />
    </div>
  );
};

export default ResultDisplay;

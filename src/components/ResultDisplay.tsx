
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

interface ResultDisplayProps {
  results: QuestionnaireResults;
  imagePreview: string | null;
  imageFile: File | null;
  onRestart: () => void;
}

const ResultDisplay = ({ results, imagePreview, imageFile, onRestart }: ResultDisplayProps) => {
  const { currentUser } = useAuth();
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
        setImageLoaded(true);
        
        // Show message that image is loaded
        toast.success("Image analysis complete!");
        console.log("Image analysis complete:", analysis);
      } catch (error) {
        console.error("Error analyzing image:", error);
        setAnalyzeError(true);
        toast.error("There was an error analyzing your image. Results will be based only on your symptoms.");
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
        <Card className="w-full p-4 sm:p-6 border-2 mb-4 sm:mb-6 bg-white shadow-md">
          <div className="flex flex-col items-center justify-center py-6 sm:py-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">Analyzing your image...</h3>
            <p className="text-sm sm:text-base text-gray-600 text-center px-2 sm:px-0">
              Our AI model is examining your uploaded image for signs of chickenpox.
              This may take a few moments.
            </p>
          </div>
        </Card>
      ) : (
        <Card className={`w-full border-2 mb-4 sm:mb-6 shadow-md ${result ? `bg-${result.likelihood === 'high' ? 'red' : result.likelihood === 'medium' ? 'amber' : result.likelihood === 'low' ? 'green' : 'blue'}-50 border-${result.likelihood === 'high' ? 'red' : result.likelihood === 'medium' ? 'amber' : result.likelihood === 'low' ? 'green' : 'blue'}-200` : ''}`}>
          {imageLoaded && imagePreview && (
            <div className="flex justify-center py-2 px-3 mx-auto mb-2 sm:mb-3 bg-gray-100 rounded-md border border-gray-300 max-w-xs sm:max-w-sm lg:max-w-md">
              <p className="text-xs sm:text-sm text-gray-800 flex items-center font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Image analyzed successfully
              </p>
            </div>
          )}
          <ResultHeader result={result} />
          <ResultContent 
            result={result} 
            imagePreview={imagePreview} 
            imageAnalysisResults={imageAnalysisResults}
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

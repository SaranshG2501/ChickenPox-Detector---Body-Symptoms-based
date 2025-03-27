
import { Card } from "@/components/ui/card";
import { QuestionnaireResults } from './SymptomsQuestionnaire';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";
import { analyzeResults } from './results/ResultAnalyzer';
import ResultHeader from './results/ResultHeader';
import ResultContent from './results/ResultContent';
import ResultActions from './results/ResultActions';
import DisclaimerComponent from './results/DisclaimerComponent';
import { handleSaveAssessment } from './results/SaveResultHandler';

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
  
  const result = analyzeResults(results);
  
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
        onSuccess: () => setIsSaved(true)
      });
      
      if (!saveSuccessful) {
        setIsSaving(false);
      }
    } catch (error) {
      setIsSaving(false);
      console.error("Error in save operation:", error);
    }
  };
  
  return (
    <div className="animate-slide-up">
      <Card className={`w-full border-2 mb-6 ${result ? `bg-${result.likelihood === 'high' ? 'red' : result.likelihood === 'medium' ? 'amber' : result.likelihood === 'low' ? 'green' : 'blue'}-50 border-${result.likelihood === 'high' ? 'red' : result.likelihood === 'medium' ? 'amber' : result.likelihood === 'low' ? 'green' : 'blue'}-200` : ''}`}>
        <ResultHeader result={result} />
        <ResultContent result={result} imagePreview={imagePreview} />
        <ResultActions 
          onRestart={onRestart} 
          onSave={saveResult}
          isSaving={isSaving}
          isSaved={isSaved}
        />
      </Card>
      
      <DisclaimerComponent />
    </div>
  );
};

export default ResultDisplay;

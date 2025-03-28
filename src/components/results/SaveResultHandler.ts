
import { QuestionnaireResults } from "../SymptomsQuestionnaire";
import { AnalysisResult } from "./AnalysisResult";
import { saveAssessment, convertImageToBase64 } from "@/lib/firebase";
import { toast } from "sonner";

export async function handleSaveAssessment({
  currentUserId,
  imageFile,
  results,
  analysisResult,
  onSuccess
}: {
  currentUserId: string;
  imageFile: File | null;
  results: QuestionnaireResults;
  analysisResult: AnalysisResult;
  onSuccess: () => void;
}) {
  try {
    let imageBase64 = null;
    if (imageFile) {
      imageBase64 = await convertImageToBase64(imageFile);
    }

    const assessmentData = {
      questionnaire: results,
      analysis: {
        likelihood: analysisResult.likelihood,
        score: analysisResult.score,
        reasons: analysisResult.reasons,
        advice: analysisResult.advice
      },
      imageUrl: imageBase64, // Changed from imageData to imageUrl to match what history page expects
      assessmentDate: new Date().toISOString()
    };

    await saveAssessment(currentUserId, assessmentData);
    onSuccess();
    toast.success("Assessment saved successfully!");
    
    return true;
  } catch (error) {
    console.error("Error saving assessment:", error);
    toast.error("Failed to save assessment. Please try again.");
    return false;
  }
}

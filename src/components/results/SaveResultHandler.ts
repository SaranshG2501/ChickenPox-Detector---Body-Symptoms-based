
import { QuestionnaireResults } from "../SymptomsQuestionnaire";
import { AnalysisResult } from "./AnalysisResult";
import { RoboflowResponse } from "../../services/roboflowService";
import { saveAssessment, convertImageToBase64 } from "@/lib/firebase";
import { toast } from "sonner";

export async function handleSaveAssessment({
  currentUserId,
  imageFile,
  results,
  analysisResult,
  imageAnalysisResults,
  onSuccess
}: {
  currentUserId: string;
  imageFile: File | null;
  results: QuestionnaireResults;
  analysisResult: AnalysisResult;
  imageAnalysisResults?: RoboflowResponse | null;
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
        advice: analysisResult.advice,
        aiConfidence: analysisResult.aiConfidence,
        alternativeDiagnoses: analysisResult.alternativeDiagnoses
      },
      imageUrl: imageBase64,
      imageAnalysis: imageAnalysisResults || null,
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

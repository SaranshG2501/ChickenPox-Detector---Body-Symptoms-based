
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

    // Create a safe version of the analysis data that doesn't include undefined values
    const analysisData = {
      likelihood: analysisResult.likelihood,
      score: analysisResult.score,
      reasons: analysisResult.reasons,
      advice: analysisResult.advice,
      // Only include these fields if they're defined
      ...(analysisResult.aiConfidence !== undefined && { aiConfidence: analysisResult.aiConfidence }),
      ...(analysisResult.alternativeDiagnoses !== undefined && { alternativeDiagnoses: analysisResult.alternativeDiagnoses })
    };

    const assessmentData = {
      questionnaire: results,
      analysis: analysisData,
      imageUrl: imageBase64,
      imageAnalysis: imageAnalysisResults || null,
      assessmentDate: new Date().toISOString()
    };

    await saveAssessment(currentUserId, assessmentData);
    toast.success("Assessment saved successfully!");
    onSuccess();
    
    return true;
  } catch (error) {
    console.error("Error saving assessment:", error);
    toast.error("Failed to save assessment. Please try again.");
    return false;
  }
}

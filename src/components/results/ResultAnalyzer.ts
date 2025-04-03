
import { AnalysisResult } from './AnalysisResult';
import { QuestionnaireResults } from '../SymptomsQuestionnaire';
import { RoboflowResponse } from '../../services/roboflowService';

export function analyzeResults(
  questionnaire: QuestionnaireResults,
  imageAnalysisResults?: RoboflowResponse
): AnalysisResult {
  // First calculate score based on questionnaire
  let score = calculateSymptomScore(questionnaire);
  
  // Default AI confidence is undefined if we don't have image analysis
  let aiConfidence: number | undefined = undefined;
  
  // Then adjust based on image analysis if available
  if (imageAnalysisResults) {
    // Check if we have valid results (not an error)
    if (!imageAnalysisResults.hasOwnProperty('error')) {
      try {
        const imageScore = analyzeImageResults(imageAnalysisResults);
        
        // Add image analysis for confidence level
        aiConfidence = imageScore.confidence;
        
        // Weight the scores - give more weight to image analysis if high confidence
        if (imageScore.confidence > 75) {
          score = score * 0.4 + imageScore.score * 0.6;
        } else if (imageScore.confidence > 50) {
          score = score * 0.5 + imageScore.score * 0.5;
        } else {
          // Low confidence in image analysis, give it less weight
          score = score * 0.7 + imageScore.score * 0.3;
        }
      } catch (error) {
        console.error("Error processing image analysis results:", error);
        // Continue with just questionnaire score if error
      }
    }
  }
  
  // Determine likelihood category based on final score
  const likelihood = determineLikelihoodCategory(score);
  
  // Generate reasons based on both questionnaire and image
  const reasons = generateReasons(questionnaire, imageAnalysisResults);
  
  // Generate appropriate advice based on likelihood
  const advice = generateAdvice(likelihood);

  // Extract alternative diagnoses if available
  const alternativeDiagnoses = extractAlternativeDiagnoses(imageAnalysisResults);
  
  return {
    likelihood,
    score,
    reasons,
    advice,
    aiConfidence,
    alternativeDiagnoses
  };
}

function calculateSymptomScore(questionnaire: QuestionnaireResults): number {
  let score = 0;
  
  // Fever is a strong indicator
  if (questionnaire.fever === 'yes') {
    score += 25;
  } else if (questionnaire.fever === 'mild') {
    score += 15;
  }
  
  // Rash is the primary symptom
  if (questionnaire.rash === 'yes') {
    score += 30;
  }
  
  // Location of rash
  if (questionnaire.rashLocation.includes('face') || 
      questionnaire.rashLocation.includes('chest') || 
      questionnaire.rashLocation.includes('back')) {
    score += 15;
  }
  
  // Blisters are characteristic
  if (questionnaire.blisters === 'yes') {
    score += 25;
  }
  
  // Itchiness is common
  if (questionnaire.itchiness === 'severe') {
    score += 15;
  } else if (questionnaire.itchiness === 'moderate') {
    score += 10;
  } else if (questionnaire.itchiness === 'mild') {
    score += 5;
  }
  
  // Recent exposure is important
  if (questionnaire.recentExposure === 'yes') {
    score += 20;
  }
  
  return Math.min(score, 100); // Cap at 100
}

function analyzeImageResults(imageResults: RoboflowResponse): { score: number, confidence: number } {
  // Extract the confidence score for chickenpox
  let confidence = 0;
  let score = 0;
  
  try {
    // If valid Roboflow prediction response
    if (!imageResults.hasOwnProperty('error')) {
      // Check for chickenpox classification
      const predictions = imageResults.predictions || [];
      
      if (predictions && predictions.length > 0) {
        // Find chickenpox prediction
        const chickenpoxPrediction = predictions.find((p: any) => 
          p.class.toLowerCase() === 'chickenpox' || 
          p.class.toLowerCase() === 'varicella' ||
          p.class.toLowerCase() === 'chicken pox');
          
        if (chickenpoxPrediction) {
          confidence = chickenpoxPrediction.confidence * 100;
          
          // Convert confidence to score
          if (confidence > 85) {
            score = 90;
          } else if (confidence > 70) {
            score = 80;
          } else if (confidence > 50) {
            score = 60;
          } else if (confidence > 30) {
            score = 40;
          } else {
            score = 20;
          }
        }
      }
    }
  } catch (error) {
    console.error("Error extracting image analysis data:", error);
    // Return low scores on error
    return { score: 0, confidence: 0 };
  }
  
  return { score, confidence };
}

function determineLikelihoodCategory(score: number): 'high' | 'medium' | 'low' | 'unknown' {
  if (score >= 70) {
    return 'high';
  } else if (score >= 40) {
    return 'medium';
  } else if (score > 0) {
    return 'low';
  } else {
    return 'unknown';
  }
}

function generateReasons(
  questionnaire: QuestionnaireResults,
  imageAnalysisResults?: RoboflowResponse
): string[] {
  const reasons: string[] = [];
  
  // Add questionnaire-based reasons
  if (questionnaire.fever === 'yes') {
    reasons.push('You reported having a fever, which commonly occurs with chickenpox.');
  } else if (questionnaire.fever === 'mild') {
    reasons.push('You reported having a mild fever, which may occur with chickenpox.');
  }
  
  if (questionnaire.rash === 'yes') {
    reasons.push('You reported having a rash, the primary symptom of chickenpox.');
  }
  
  if (questionnaire.blisters === 'yes') {
    reasons.push('You reported fluid-filled blisters, which are characteristic of chickenpox.');
  }
  
  if (questionnaire.itchiness === 'severe' || questionnaire.itchiness === 'moderate') {
    reasons.push('You reported significant itchiness, which is typical of chickenpox.');
  }
  
  if (questionnaire.recentExposure === 'yes') {
    reasons.push('You reported recent exposure to someone with chickenpox, which increases the likelihood.');
  }
  
  // Add image-based reasons if available
  if (imageAnalysisResults && !imageAnalysisResults.hasOwnProperty('error')) {
    try {
      const predictions = imageAnalysisResults.predictions || [];
      if (predictions && predictions.length > 0) {
        // Find chickenpox prediction
        const chickenpoxPrediction = predictions.find((p: any) => 
          p.class.toLowerCase() === 'chickenpox' || 
          p.class.toLowerCase() === 'varicella' ||
          p.class.toLowerCase() === 'chicken pox');
          
        if (chickenpoxPrediction) {
          const confidence = Math.round(chickenpoxPrediction.confidence * 100);
          
          if (confidence > 70) {
            reasons.push(`The image analysis detected patterns consistent with chickenpox with high confidence (${confidence}%).`);
          } else if (confidence > 50) {
            reasons.push(`The image analysis detected some patterns that may be consistent with chickenpox (${confidence}% confidence).`);
          } else {
            reasons.push(`The image analysis detected limited visual indicators of chickenpox (${confidence}% confidence).`);
          }
        } else {
          reasons.push('The image analysis did not detect clear signs of chickenpox.');
        }
      }
    } catch (error) {
      console.error("Error generating image-based reasons:", error);
    }
  }
  
  return reasons;
}

function generateAdvice(likelihood: 'high' | 'medium' | 'low' | 'unknown'): string {
  switch (likelihood) {
    case 'high':
      return 'Based on your symptoms and assessment, there is a high likelihood this could be chickenpox. We recommend consulting with a healthcare provider promptly for confirmation and appropriate treatment.';
    case 'medium':
      return 'Your symptoms suggest a possible case of chickenpox. We recommend consulting with a healthcare provider for a proper diagnosis and guidance.';
    case 'low':
      return 'While some symptoms may be present, the likelihood of chickenpox appears low. Monitor your symptoms and consult a healthcare provider if they worsen or if you have concerns.';
    case 'unknown':
    default:
      return 'Based on the limited information provided, we cannot determine the likelihood of chickenpox. Please consult a healthcare provider for a proper evaluation.';
  }
}

function extractAlternativeDiagnoses(imageAnalysisResults?: RoboflowResponse): string[] | undefined {
  if (!imageAnalysisResults || imageAnalysisResults.hasOwnProperty('error')) {
    return undefined;
  }
  
  try {
    const predictions = imageAnalysisResults.predictions || [];
    
    if (!predictions || predictions.length === 0) {
      return undefined;
    }
    
    // Filter out chickenpox and low confidence predictions
    const otherConditions = predictions
      .filter((p: any) => {
        const className = p.class.toLowerCase();
        return (
          className !== 'chickenpox' && 
          className !== 'varicella' &&
          className !== 'chicken pox' &&
          p.confidence > 0.15 // Only include if at least 15% confidence
        );
      })
      .map((p: any) => {
        // Format the condition name and confidence
        const name = p.class
          .split('_')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ');
        const confidence = Math.round(p.confidence * 100);
        return `${name} (${confidence}% confidence)`;
      });
    
    return otherConditions.length > 0 ? otherConditions : undefined;
  } catch (error) {
    console.error("Error extracting alternative diagnoses:", error);
    return undefined;
  }
}

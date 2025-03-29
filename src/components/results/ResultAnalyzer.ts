import { QuestionnaireResults } from '../SymptomsQuestionnaire';
import { AnalysisResult } from './AnalysisResult';
import { RoboflowResponse } from '../../services/roboflowService';

export function analyzeResults(
  results: QuestionnaireResults,
  imageAnalysis?: RoboflowResponse
): AnalysisResult {
  let score = 0;
  const reasons: string[] = [];
  
  if (imageAnalysis && imageAnalysis.predictions && imageAnalysis.predictions.length > 0) {
    const chickenpoxPredictions = imageAnalysis.predictions.filter(
      pred => pred.class.toLowerCase().includes('chicken') || 
             pred.class.toLowerCase().includes('pox')
    );
    
    if (chickenpoxPredictions.length > 0) {
      const maxConfidence = Math.max(...chickenpoxPredictions.map(pred => pred.confidence));
      
      if (maxConfidence > 0.7) {
        score += 5;
        reasons.push(`AI model detected chickenpox with high confidence (${(maxConfidence * 100).toFixed(1)}%)`);
      } else if (maxConfidence > 0.4) {
        score += 3;
        reasons.push(`AI model detected possible chickenpox (${(maxConfidence * 100).toFixed(1)}%)`);
      } else if (maxConfidence > 0.2) {
        score += 1;
        reasons.push(`AI model detected low possibility of chickenpox (${(maxConfidence * 100).toFixed(1)}%)`);
      }
    } else if (imageAnalysis.predictions.length > 0) {
      const otherConditions = [...new Set(imageAnalysis.predictions.map(pred => pred.class))];
      if (otherConditions.length > 0) {
        score -= 2;
        reasons.push(`AI model detected other skin condition(s): ${otherConditions.join(', ')}`);
      }
    }
  }
  
  if (results.fever === 'high') {
    score += 3;
    reasons.push("High fever (common in chicken pox)");
  } else if (results.fever === 'mild') {
    score += 2;
    reasons.push("Mild fever (can occur with chicken pox)");
  }
  
  if (results.rashAppearance === 'fluid-blisters') {
    score += 4;
    reasons.push("Fluid-filled blisters (characteristic of chicken pox)");
  } else if (results.rashAppearance === 'mixed') {
    score += 3;
    reasons.push("Mix of different stage lesions (typical of chicken pox)");
  } else if (results.rashAppearance === 'red-spots') {
    score += 2;
    reasons.push("Red spots (could be early chicken pox)");
  } else if (results.rashAppearance === 'crusted') {
    score += 2;
    reasons.push("Crusted lesions (could be healing chicken pox)");
  }
  
  const bodyCount = results.rashLocation.length;
  const widespreadLocations = ['face', 'chest', 'back', 'stomach', 'arms', 'legs'].filter(
    loc => results.rashLocation.includes(loc)
  ).length;
  
  if (bodyCount >= 4) {
    score += 3;
    reasons.push("Widespread rash (typical of chicken pox)");
  } else if (bodyCount >= 2) {
    score += 2;
    reasons.push("Multiple locations affected");
  }
  
  if (results.rashLocation.includes('inside-mouth')) {
    score += 2;
    reasons.push("Lesions inside mouth (common in chicken pox)");
  }
  
  if (results.rashLocation.includes('palms-soles')) {
    score -= 2;
    reasons.push("Palms/soles affected (unusual for chicken pox)");
  }
  
  if (results.rashItchy === 'very') {
    score += 3;
    reasons.push("Very itchy rash (typical of chicken pox)");
  } else if (results.rashItchy === 'somewhat') {
    score += 1;
    reasons.push("Somewhat itchy rash");
  } else if (results.rashItchy === 'painful') {
    score -= 1;
    reasons.push("More painful than itchy (less typical for chicken pox)");
  }
  
  const relevantSymptoms = ['headache', 'fatigue', 'loss-appetite', 'swollen-lymph'].filter(
    symp => results.otherSymptoms.includes(symp)
  ).length;
  
  if (relevantSymptoms >= 2) {
    score += 2;
    reasons.push("Multiple relevant symptoms (common with chicken pox)");
  } else if (relevantSymptoms === 1) {
    score += 1;
    reasons.push("Some relevant symptoms present");
  }
  
  if (results.exposureHistory === 'known') {
    score += 4;
    reasons.push("Known exposure to chicken pox (significant risk factor)");
  } else if (results.exposureHistory === 'possible') {
    score += 2;
    reasons.push("Possible exposure to chicken pox");
  } else if (results.exposureHistory === 'history') {
    score -= 3;
    reasons.push("Prior chicken pox/vaccination (reduces likelihood)");
  }
  
  if (results.daysWithSymptoms === '2-3' || results.daysWithSymptoms === '4-7') {
    score += 2;
    reasons.push("Timeline consistent with chicken pox progression");
  }
  
  let likelihood: 'high' | 'medium' | 'low' | 'unknown' = 'unknown';
  let advice = '';
  let aiConfidence: number | null = null;
  let alternativeDiagnoses: string[] = [];
  
  if (imageAnalysis && imageAnalysis.predictions) {
    const chickenpoxPredictions = imageAnalysis.predictions.filter(
      pred => pred.class.toLowerCase().includes('chicken') || 
              pred.class.toLowerCase().includes('pox')
    );
    
    if (chickenpoxPredictions.length > 0) {
      aiConfidence = Math.max(...chickenpoxPredictions.map(pred => pred.confidence)) * 100;
    }
    
    alternativeDiagnoses = [...new Set(
      imageAnalysis.predictions
        .filter(pred => !(pred.class.toLowerCase().includes('chicken') || 
                         pred.class.toLowerCase().includes('pox')))
        .map(pred => pred.class)
    )];
  }
  
  if (score >= 10) {
    likelihood = 'high';
    advice = "The symptoms you've described align strongly with chicken pox. We recommend consulting a healthcare provider as soon as possible for confirmation and treatment. Avoid contact with others, especially pregnant women, newborns, and immunocompromised individuals.";
    
    if (aiConfidence !== null) {
      advice += ` Our AI analysis shows ${aiConfidence.toFixed(1)}% confidence that the rash in your image is chickenpox.`;
    }
  } else if (score >= 6) {
    likelihood = 'medium';
    advice = "Your symptoms have some features consistent with chicken pox. We recommend consulting a healthcare provider for proper diagnosis and advice. In the meantime, avoid close contact with others and monitor for any changes in symptoms.";
    
    if (aiConfidence !== null) {
      advice += ` Our AI analysis shows ${aiConfidence.toFixed(1)}% confidence that the rash in your image is chickenpox.`;
    }
  } else if (score >= 0) {
    likelihood = 'low';
    advice = "Your symptoms have few features typically associated with chicken pox, but a healthcare provider should evaluate any rash or concerning symptoms.";
    
    if (aiConfidence !== null) {
      advice += ` Our AI analysis shows ${aiConfidence.toFixed(1)}% confidence that the rash in your image is chickenpox.`;
    }
    
    if (alternativeDiagnoses.length > 0) {
      advice += ` The AI model suggests your rash might be related to: ${alternativeDiagnoses.join(', ')}.`;
    }
    
    advice += " There are many conditions that can cause rashes, and professional diagnosis is important.";
  } else {
    likelihood = 'unknown';
    advice = "Based on the information provided, we cannot determine if chicken pox is likely.";
    
    if (aiConfidence !== null) {
      advice += ` Our AI analysis shows ${aiConfidence.toFixed(1)}% confidence that the rash in your image is chickenpox.`;
    }
    
    if (alternativeDiagnoses.length > 0) {
      advice += ` The AI model suggests your symptoms might be related to: ${alternativeDiagnoses.join(', ')}.`;
    }
    
    advice += " These symptoms may point to other categories of diseases for which we recommend you consult a doctor.";
  }
  
  return { 
    likelihood, 
    score, 
    reasons, 
    advice, 
    aiConfidence: aiConfidence !== null ? aiConfidence : undefined,
    alternativeDiagnoses: alternativeDiagnoses.length > 0 ? alternativeDiagnoses : undefined
  };
}

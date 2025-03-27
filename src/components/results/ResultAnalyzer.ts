
import { QuestionnaireResults } from '../SymptomsQuestionnaire';
import { AnalysisResult } from './AnalysisResult';

export function analyzeResults(results: QuestionnaireResults): AnalysisResult {
  let score = 0;
  const reasons: string[] = [];
  
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
  
  if (score >= 10) {
    likelihood = 'high';
    advice = "The symptoms you've described align strongly with chicken pox. We recommend consulting a healthcare provider as soon as possible for confirmation and treatment. Avoid contact with others, especially pregnant women, newborns, and immunocompromised individuals.";
  } else if (score >= 6) {
    likelihood = 'medium';
    advice = "Your symptoms have some features consistent with chicken pox. We recommend consulting a healthcare provider for proper diagnosis and advice. In the meantime, avoid close contact with others and monitor for any changes in symptoms.";
  } else if (score >= 0) {
    likelihood = 'low';
    advice = "Your symptoms have few features typically associated with chicken pox, but a healthcare provider should evaluate any rash or concerning symptoms. There are many conditions that can cause rashes, and professional diagnosis is important.";
  } else {
    likelihood = 'unknown';
    advice = "Based on the information provided, we cannot determine if chicken pox is likely. Please consult a healthcare provider for proper evaluation and diagnosis.";
  }
  
  return { likelihood, score, reasons, advice };
}

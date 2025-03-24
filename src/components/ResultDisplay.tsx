import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, HelpCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { QuestionnaireResults } from './SymptomsQuestionnaire';

interface ResultDisplayProps {
  results: QuestionnaireResults;
  imagePreview: string | null;
  onRestart: () => void;
}

const ResultDisplay = ({ results, imagePreview, onRestart }: ResultDisplayProps) => {
  // Logic to determine the likelihood of chicken pox
  const analyzeResults = (): { 
    likelihood: 'high' | 'medium' | 'low' | 'unknown',
    score: number,
    reasons: string[],
    advice: string
  } => {
    let score = 0;
    const reasons: string[] = [];
    
    // Fever assessment
    if (results.fever === 'high') {
      score += 3;
      reasons.push("High fever (common in chicken pox)");
    } else if (results.fever === 'mild') {
      score += 2;
      reasons.push("Mild fever (can occur with chicken pox)");
    }
    
    // Rash appearance
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
    
    // Rash distribution
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
    
    // Inside mouth is significant
    if (results.rashLocation.includes('inside-mouth')) {
      score += 2;
      reasons.push("Lesions inside mouth (common in chicken pox)");
    }
    
    // Palms and soles typically NOT affected in chicken pox
    if (results.rashLocation.includes('palms-soles')) {
      score -= 2;
      reasons.push("Palms/soles affected (unusual for chicken pox)");
    }
    
    // Itchiness
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
    
    // Other symptoms
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
    
    // Exposure history
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
    
    // Duration
    if (results.daysWithSymptoms === '2-3' || results.daysWithSymptoms === '4-7') {
      score += 2;
      reasons.push("Timeline consistent with chicken pox progression");
    }
    
    // Determine likelihood category and advice
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
  };
  
  const result = analyzeResults();
  
  // Color and icon mapping based on likelihood
  const resultDisplay = {
    high: {
      icon: <AlertCircle className="h-8 w-8 text-red-500" />,
      title: "High Likelihood of Chicken Pox",
      color: "bg-red-50 border-red-200",
      badge: <Badge className="bg-red-500">High Likelihood</Badge>
    },
    medium: {
      icon: <HelpCircle className="h-8 w-8 text-amber-500" />,
      title: "Possible Chicken Pox",
      color: "bg-amber-50 border-amber-200",
      badge: <Badge className="bg-amber-500">Medium Likelihood</Badge>
    },
    low: {
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      title: "Low Likelihood of Chicken Pox",
      color: "bg-green-50 border-green-200",
      badge: <Badge className="bg-green-500">Low Likelihood</Badge>
    },
    unknown: {
      icon: <HelpCircle className="h-8 w-8 text-blue-500" />,
      title: "Uncertain Assessment",
      color: "bg-blue-50 border-blue-200",
      badge: <Badge className="bg-blue-500">Uncertain</Badge>
    }
  };
  
  const current = resultDisplay[result.likelihood];
  
  return (
    <div className="animate-slide-up">
      <Card className={`w-full border-2 mb-6 ${current.color}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {current.icon}
              <CardTitle className="ml-2 text-xl">{current.title}</CardTitle>
            </div>
            {current.badge}
          </div>
          <CardDescription className="mt-2">
            This assessment is based on the information you provided and image analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-4">
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
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <Button variant="outline" onClick={onRestart}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Start New Assessment
          </Button>
          <Button>
            <ExternalLink className="mr-2 h-4 w-4" />
            Consult Doctor
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Important Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">
            This application provides a preliminary assessment only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this application.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultDisplay;

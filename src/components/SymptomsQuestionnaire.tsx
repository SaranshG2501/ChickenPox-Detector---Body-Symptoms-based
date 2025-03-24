
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export interface QuestionnaireResults {
  fever: string;
  rashAppearance: string;
  rashLocation: string[];
  rashItchy: string;
  otherSymptoms: string[];
  exposureHistory: string;
  daysWithSymptoms: string;
}

interface SymptomsQuestionnaireProps {
  onComplete: (results: QuestionnaireResults) => void;
}

const defaultAnswers: QuestionnaireResults = {
  fever: '',
  rashAppearance: '',
  rashLocation: [],
  rashItchy: '',
  otherSymptoms: [],
  exposureHistory: '',
  daysWithSymptoms: '',
};

const SymptomsQuestionnaire = ({ onComplete }: SymptomsQuestionnaireProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<QuestionnaireResults>(defaultAnswers);
  const totalSteps = 7;

  const updateAnswer = (field: keyof QuestionnaireResults, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const toggleCheckboxValue = (field: keyof QuestionnaireResults, value: string) => {
    setAnswers(prev => {
      const currentValues = prev[field] as string[];
      if (currentValues.includes(value)) {
        return { ...prev, [field]: currentValues.filter(v => v !== value) };
      } else {
        return { ...prev, [field]: [...currentValues, value] };
      }
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!answers.fever;
      case 2: return !!answers.rashAppearance;
      case 3: return answers.rashLocation.length > 0;
      case 4: return !!answers.rashItchy;
      case 5: return true; // Optional step
      case 6: return !!answers.exposureHistory;
      case 7: return !!answers.daysWithSymptoms;
      default: return false;
    }
  };

  const renderFeverQuestion = () => (
    <>
      <CardHeader>
        <CardTitle className="text-xl">Have you experienced a fever?</CardTitle>
        <CardDescription>
          Chicken pox often begins with a fever before the rash appears.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={answers.fever} 
          onValueChange={(value) => updateAnswer('fever', value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="fever-high" />
            <Label htmlFor="fever-high">Yes, high fever (over 101°F/38.3°C)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mild" id="fever-mild" />
            <Label htmlFor="fever-mild">Yes, mild fever</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="fever-no" />
            <Label htmlFor="fever-no">No fever</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unsure" id="fever-unsure" />
            <Label htmlFor="fever-unsure">Unsure/haven't checked</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </>
  );

  const renderRashAppearanceQuestion = () => (
    <>
      <CardHeader>
        <CardTitle className="text-xl">How would you describe the rash?</CardTitle>
        <CardDescription>
          Chicken pox typically appears as fluid-filled blisters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={answers.rashAppearance} 
          onValueChange={(value) => updateAnswer('rashAppearance', value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fluid-blisters" id="rash-blisters" />
            <Label htmlFor="rash-blisters">Small fluid-filled blisters</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="red-spots" id="rash-spots" />
            <Label htmlFor="rash-spots">Small red spots/bumps</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="crusted" id="rash-crusted" />
            <Label htmlFor="rash-crusted">Crusted or scabbed spots</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mixed" id="rash-mixed" />
            <Label htmlFor="rash-mixed">Mix of the above (different stages)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="rash-other" />
            <Label htmlFor="rash-other">Other type of rash</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </>
  );

  const renderRashLocationQuestion = () => (
    <>
      <CardHeader>
        <CardTitle className="text-xl">Where is the rash located?</CardTitle>
        <CardDescription>
          Chicken pox typically starts on the chest, back, or face and spreads to the rest of the body.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'face', label: 'Face' },
            { id: 'scalp', label: 'Scalp/Hairline' },
            { id: 'chest', label: 'Chest' },
            { id: 'back', label: 'Back' },
            { id: 'stomach', label: 'Stomach' },
            { id: 'arms', label: 'Arms' },
            { id: 'legs', label: 'Legs' },
            { id: 'inside-mouth', label: 'Inside mouth' },
            { id: 'palms-soles', label: 'Palms/Soles' },
            { id: 'groin', label: 'Groin area' }
          ].map(location => (
            <div className="flex items-center space-x-2" key={location.id}>
              <Checkbox 
                id={`location-${location.id}`}
                checked={answers.rashLocation.includes(location.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    toggleCheckboxValue('rashLocation', location.id);
                  } else {
                    toggleCheckboxValue('rashLocation', location.id);
                  }
                }}
              />
              <Label htmlFor={`location-${location.id}`}>{location.label}</Label>
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );

  const renderRashItchyQuestion = () => (
    <>
      <CardHeader>
        <CardTitle className="text-xl">Is the rash itchy?</CardTitle>
        <CardDescription>
          Chicken pox rash is usually very itchy.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={answers.rashItchy} 
          onValueChange={(value) => updateAnswer('rashItchy', value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="very" id="itchy-very" />
            <Label htmlFor="itchy-very">Yes, very itchy</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="somewhat" id="itchy-somewhat" />
            <Label htmlFor="itchy-somewhat">Somewhat itchy</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="itchy-no" />
            <Label htmlFor="itchy-no">Not itchy</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="painful" id="itchy-painful" />
            <Label htmlFor="itchy-painful">More painful than itchy</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </>
  );

  const renderOtherSymptomsQuestion = () => (
    <>
      <CardHeader>
        <CardTitle className="text-xl">Are you experiencing any other symptoms?</CardTitle>
        <CardDescription>
          Check all that apply.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'headache', label: 'Headache' },
            { id: 'fatigue', label: 'Fatigue/Tiredness' },
            { id: 'sore-throat', label: 'Sore throat' },
            { id: 'loss-appetite', label: 'Loss of appetite' },
            { id: 'muscle-pain', label: 'Muscle/joint aches' },
            { id: 'swollen-lymph', label: 'Swollen lymph nodes' },
            { id: 'cough', label: 'Cough' },
            { id: 'none', label: 'None of these' }
          ].map(symptom => (
            <div className="flex items-center space-x-2" key={symptom.id}>
              <Checkbox 
                id={`symptom-${symptom.id}`}
                checked={answers.otherSymptoms.includes(symptom.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    toggleCheckboxValue('otherSymptoms', symptom.id);
                  } else {
                    toggleCheckboxValue('otherSymptoms', symptom.id);
                  }
                }}
              />
              <Label htmlFor={`symptom-${symptom.id}`}>{symptom.label}</Label>
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );

  const renderExposureQuestion = () => (
    <>
      <CardHeader>
        <CardTitle className="text-xl">Have you been exposed to chicken pox recently?</CardTitle>
        <CardDescription>
          Chicken pox is highly contagious and spreads through direct contact or airborne droplets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={answers.exposureHistory} 
          onValueChange={(value) => updateAnswer('exposureHistory', value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="known" id="exposure-known" />
            <Label htmlFor="exposure-known">Yes, I've had known contact with someone with chicken pox</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="possible" id="exposure-possible" />
            <Label htmlFor="exposure-possible">Possibly, but I'm not certain</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="exposure-no" />
            <Label htmlFor="exposure-no">No known exposure</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="history" id="exposure-history" />
            <Label htmlFor="exposure-history">I've had chicken pox before/I'm vaccinated</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </>
  );

  const renderDurationQuestion = () => (
    <>
      <CardHeader>
        <CardTitle className="text-xl">How many days have you had symptoms?</CardTitle>
        <CardDescription>
          Chicken pox rash typically appears 1-2 days after fever begins.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={answers.daysWithSymptoms} 
          onValueChange={(value) => updateAnswer('daysWithSymptoms', value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="duration-1" />
            <Label htmlFor="duration-1">1 day or less</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2-3" id="duration-2-3" />
            <Label htmlFor="duration-2-3">2-3 days</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4-7" id="duration-4-7" />
            <Label htmlFor="duration-4-7">4-7 days</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="over-7" id="duration-over-7" />
            <Label htmlFor="duration-over-7">More than 7 days</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </>
  );

  const renderCurrentQuestion = () => {
    switch (currentStep) {
      case 1: return renderFeverQuestion();
      case 2: return renderRashAppearanceQuestion();
      case 3: return renderRashLocationQuestion();
      case 4: return renderRashItchyQuestion();
      case 5: return renderOtherSymptomsQuestion();
      case 6: return renderExposureQuestion();
      case 7: return renderDurationQuestion();
      default: return null;
    }
  };

  return (
    <Card className="w-full animate-slide-up">
      {renderCurrentQuestion()}
      <CardFooter className="flex justify-between border-t p-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <div className="flex gap-3">
          {currentStep > 1 && (
            <Button 
              variant="outline" 
              onClick={handleBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          <Button 
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {currentStep === totalSteps ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Complete
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SymptomsQuestionnaire;

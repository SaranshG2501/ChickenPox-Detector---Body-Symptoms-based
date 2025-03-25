
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionnaireResults } from '@/components/SymptomsQuestionnaire';

interface QuestionnaireResponsesCardProps {
  questionnaire: QuestionnaireResults;
}

export const QuestionnaireResponsesCard = ({ questionnaire }: QuestionnaireResponsesCardProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Questionnaire Responses</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
          <div>
            <dt className="font-medium">Fever</dt>
            <dd className="text-gray-600 mt-1">
              {questionnaire.fever === 'high' && 'Yes, high fever (over 101°F/38.3°C)'}
              {questionnaire.fever === 'mild' && 'Yes, mild fever'}
              {questionnaire.fever === 'no' && 'No fever'}
              {questionnaire.fever === 'unsure' && 'Unsure/haven\'t checked'}
            </dd>
          </div>
          
          <div>
            <dt className="font-medium">Rash Appearance</dt>
            <dd className="text-gray-600 mt-1">
              {questionnaire.rashAppearance === 'fluid-blisters' && 'Small fluid-filled blisters'}
              {questionnaire.rashAppearance === 'red-spots' && 'Small red spots/bumps'}
              {questionnaire.rashAppearance === 'crusted' && 'Crusted or scabbed spots'}
              {questionnaire.rashAppearance === 'mixed' && 'Mix of different stages'}
              {questionnaire.rashAppearance === 'other' && 'Other type of rash'}
            </dd>
          </div>
          
          <div>
            <dt className="font-medium">Rash Location</dt>
            <dd className="text-gray-600 mt-1">
              {questionnaire.rashLocation.map((location: string) => {
                const locationMap: {[key: string]: string} = {
                  'face': 'Face', 
                  'scalp': 'Scalp/Hairline',
                  'chest': 'Chest',
                  'back': 'Back',
                  'stomach': 'Stomach',
                  'arms': 'Arms',
                  'legs': 'Legs',
                  'inside-mouth': 'Inside mouth',
                  'palms-soles': 'Palms/Soles',
                  'groin': 'Groin area'
                };
                return locationMap[location] || location;
              }).join(', ')}
            </dd>
          </div>
          
          <div>
            <dt className="font-medium">Itchiness</dt>
            <dd className="text-gray-600 mt-1">
              {questionnaire.rashItchy === 'very' && 'Very itchy'}
              {questionnaire.rashItchy === 'somewhat' && 'Somewhat itchy'}
              {questionnaire.rashItchy === 'no' && 'Not itchy'}
              {questionnaire.rashItchy === 'painful' && 'More painful than itchy'}
            </dd>
          </div>
          
          {questionnaire.otherSymptoms && questionnaire.otherSymptoms.length > 0 && (
            <div>
              <dt className="font-medium">Other Symptoms</dt>
              <dd className="text-gray-600 mt-1">
                {questionnaire.otherSymptoms.map((symptom: string) => {
                  const symptomMap: {[key: string]: string} = {
                    'headache': 'Headache',
                    'fatigue': 'Fatigue/Tiredness',
                    'sore-throat': 'Sore throat',
                    'loss-appetite': 'Loss of appetite',
                    'muscle-pain': 'Muscle/joint aches',
                    'swollen-lymph': 'Swollen lymph nodes',
                    'cough': 'Cough',
                    'none': 'None of these'
                  };
                  return symptomMap[symptom] || symptom;
                }).join(', ')}
              </dd>
            </div>
          )}
          
          <div>
            <dt className="font-medium">Exposure History</dt>
            <dd className="text-gray-600 mt-1">
              {questionnaire.exposureHistory === 'known' && 'Known contact with someone with chicken pox'}
              {questionnaire.exposureHistory === 'possible' && 'Possible exposure, not certain'}
              {questionnaire.exposureHistory === 'no' && 'No known exposure'}
              {questionnaire.exposureHistory === 'history' && 'Had chicken pox before/vaccinated'}
            </dd>
          </div>
          
          <div>
            <dt className="font-medium">Duration of Symptoms</dt>
            <dd className="text-gray-600 mt-1">
              {questionnaire.daysWithSymptoms === '1' && '1 day or less'}
              {questionnaire.daysWithSymptoms === '2-3' && '2-3 days'}
              {questionnaire.daysWithSymptoms === '4-7' && '4-7 days'}
              {questionnaire.daysWithSymptoms === 'over-7' && 'More than 7 days'}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
};

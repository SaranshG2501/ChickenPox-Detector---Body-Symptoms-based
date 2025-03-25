
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAssessmentById } from '@/lib/firebase';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  CheckCircle, 
  HelpCircle, 
  CalendarIcon, 
  ArrowLeft, 
  Printer, 
  Download 
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

// Define interface for the assessment data
interface AssessmentData {
  id: string;
  userId: string;
  questionnaire: any;
  analysis: {
    likelihood: 'high' | 'medium' | 'low' | 'unknown';
    score: number;
    reasons: string[];
    advice: string;
  };
  imageUrl: string | null;
  assessmentDate: string;
  createdAt: any;
}

const AssessmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!id || !currentUser) return;
      
      try {
        setLoading(true);
        const assessmentData = await getAssessmentById(id) as AssessmentData;
        
        // Ensure the assessment belongs to the current user
        if (assessmentData.userId !== currentUser.uid) {
          toast.error("You don't have permission to view this assessment");
          navigate('/history');
          return;
        }
        
        setAssessment(assessmentData);
      } catch (error) {
        console.error('Error fetching assessment:', error);
        toast.error('Failed to load assessment details.');
        navigate('/history');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id, currentUser, navigate]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPP p');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getLikelihoodInfo = (likelihood: 'high' | 'medium' | 'low' | 'unknown') => {
    const styles = {
      high: { 
        bg: 'bg-red-50 border-red-200', 
        badge: 'bg-red-500',
        icon: <AlertCircle className="h-8 w-8 text-red-500" />,
        title: "High Likelihood of Chicken Pox"
      },
      medium: { 
        bg: 'bg-amber-50 border-amber-200', 
        badge: 'bg-amber-500',
        icon: <HelpCircle className="h-8 w-8 text-amber-500" />,
        title: "Possible Chicken Pox"
      },
      low: { 
        bg: 'bg-green-50 border-green-200', 
        badge: 'bg-green-500',
        icon: <CheckCircle className="h-8 w-8 text-green-500" />,
        title: "Low Likelihood of Chicken Pox"
      },
      unknown: { 
        bg: 'bg-blue-50 border-blue-200', 
        badge: 'bg-blue-500',
        icon: <HelpCircle className="h-8 w-8 text-blue-500" />,
        title: "Uncertain Assessment"
      }
    };

    return styles[likelihood];
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medical-600"></div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl">Assessment not found</h2>
        <Button 
          onClick={() => navigate('/history')}
          className="mt-4"
        >
          Return to History
        </Button>
      </div>
    );
  }

  const { bg, badge, icon, title } = getLikelihoodInfo(assessment.analysis.likelihood);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10 opacity-50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-medical-100 rounded-full filter blur-3xl opacity-30 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-medical-200 rounded-full filter blur-3xl opacity-30 transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      {/* Header */}
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8 print:hidden">
        <div className="max-w-4xl mx-auto">
          <div className="glass px-6 py-4 rounded-2xl">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                className="mr-2" 
                onClick={() => navigate('/history')}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to History
              </Button>
              <h1 className="text-2xl font-medium">
                <span className="text-medical-700">Assessment</span> Details
              </h1>
            </div>
            <p className="mt-2 text-gray-600">
              Detailed report from {formatDate(assessment.assessmentDate)}
            </p>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 print:py-0 print:px-0 print:max-w-none">
        <div className="glass p-6 rounded-2xl print:shadow-none print:rounded-none print:p-0">
          {/* Assessment Result Card */}
          <Card className={`w-full border-2 mb-6 ${bg}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {icon}
                  <CardTitle className="ml-2 text-xl">{title}</CardTitle>
                </div>
                <Badge className={badge}>
                  {assessment.analysis.likelihood === 'high' 
                    ? 'High' 
                    : assessment.analysis.likelihood === 'medium'
                    ? 'Medium'
                    : assessment.analysis.likelihood === 'low'
                    ? 'Low'
                    : 'Unknown'} Likelihood
                </Badge>
              </div>
              <CardDescription className="mt-2 flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Assessment Date: {formatDate(assessment.assessmentDate)}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Key Factors:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {assessment.analysis.reasons.map((reason: string, index: number) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Recommendation:</h3>
                  <p className="text-sm">{assessment.analysis.advice}</p>
                </div>
                
                {assessment.imageUrl && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Uploaded Image:</h3>
                    <div className="relative border rounded-md overflow-hidden">
                      <img 
                        src={assessment.imageUrl} 
                        alt="Skin condition" 
                        className="w-full max-h-60 object-contain" 
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t p-4 print:hidden">
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Report
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          {/* Questionnaire Responses */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Questionnaire Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="font-medium">Fever</dt>
                  <dd className="text-gray-600 mt-1">
                    {assessment.questionnaire.fever === 'high' && 'Yes, high fever (over 101°F/38.3°C)'}
                    {assessment.questionnaire.fever === 'mild' && 'Yes, mild fever'}
                    {assessment.questionnaire.fever === 'no' && 'No fever'}
                    {assessment.questionnaire.fever === 'unsure' && 'Unsure/haven\'t checked'}
                  </dd>
                </div>
                
                <div>
                  <dt className="font-medium">Rash Appearance</dt>
                  <dd className="text-gray-600 mt-1">
                    {assessment.questionnaire.rashAppearance === 'fluid-blisters' && 'Small fluid-filled blisters'}
                    {assessment.questionnaire.rashAppearance === 'red-spots' && 'Small red spots/bumps'}
                    {assessment.questionnaire.rashAppearance === 'crusted' && 'Crusted or scabbed spots'}
                    {assessment.questionnaire.rashAppearance === 'mixed' && 'Mix of different stages'}
                    {assessment.questionnaire.rashAppearance === 'other' && 'Other type of rash'}
                  </dd>
                </div>
                
                <div>
                  <dt className="font-medium">Rash Location</dt>
                  <dd className="text-gray-600 mt-1">
                    {assessment.questionnaire.rashLocation.map((location: string) => {
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
                    {assessment.questionnaire.rashItchy === 'very' && 'Very itchy'}
                    {assessment.questionnaire.rashItchy === 'somewhat' && 'Somewhat itchy'}
                    {assessment.questionnaire.rashItchy === 'no' && 'Not itchy'}
                    {assessment.questionnaire.rashItchy === 'painful' && 'More painful than itchy'}
                  </dd>
                </div>
                
                {assessment.questionnaire.otherSymptoms && assessment.questionnaire.otherSymptoms.length > 0 && (
                  <div>
                    <dt className="font-medium">Other Symptoms</dt>
                    <dd className="text-gray-600 mt-1">
                      {assessment.questionnaire.otherSymptoms.map((symptom: string) => {
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
                    {assessment.questionnaire.exposureHistory === 'known' && 'Known contact with someone with chicken pox'}
                    {assessment.questionnaire.exposureHistory === 'possible' && 'Possible exposure, not certain'}
                    {assessment.questionnaire.exposureHistory === 'no' && 'No known exposure'}
                    {assessment.questionnaire.exposureHistory === 'history' && 'Had chicken pox before/vaccinated'}
                  </dd>
                </div>
                
                <div>
                  <dt className="font-medium">Duration of Symptoms</dt>
                  <dd className="text-gray-600 mt-1">
                    {assessment.questionnaire.daysWithSymptoms === '1' && '1 day or less'}
                    {assessment.questionnaire.daysWithSymptoms === '2-3' && '2-3 days'}
                    {assessment.questionnaire.daysWithSymptoms === '4-7' && '4-7 days'}
                    {assessment.questionnaire.daysWithSymptoms === 'over-7' && 'More than 7 days'}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          {/* Disclaimer */}
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
      </main>
      
      {/* Footer */}
      <footer className="w-full py-4 px-4 sm:px-6 lg:px-8 mt-auto print:hidden">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-sm text-gray-500">
            <p>This is a demonstration application. Always consult a healthcare professional for medical advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AssessmentDetail;


import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAssessmentById } from '@/lib/firebase';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { QuestionnaireResults } from '@/components/SymptomsQuestionnaire';
import { Timestamp } from 'firebase/firestore';
import { AssessmentHeader } from '@/components/assessment/AssessmentHeader';
import { AssessmentResultCard } from '@/components/assessment/AssessmentResultCard';
import { QuestionnaireResponsesCard } from '@/components/assessment/QuestionnaireResponsesCard';
import { DisclaimerCard } from '@/components/assessment/DisclaimerCard';
import { AssessmentFooter } from '@/components/assessment/AssessmentFooter';

interface AssessmentData {
  id: string;
  userId: string;
  questionnaire: QuestionnaireResults;
  analysis: {
    likelihood: 'high' | 'medium' | 'low' | 'unknown';
    score: number;
    reasons: string[];
    advice: string;
  };
  imageUrl: string | null;
  assessmentDate: string;
  createdAt: Timestamp;
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
        <button 
          onClick={() => navigate('/history')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded"
        >
          Return to History
        </button>
      </div>
    );
  }

  const formattedDate = formatDate(assessment.assessmentDate);

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 overflow-hidden -z-10 opacity-50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-medical-100 rounded-full filter blur-3xl opacity-30 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-medical-200 rounded-full filter blur-3xl opacity-30 transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <AssessmentHeader date={formattedDate} />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 print:py-0 print:px-0 print:max-w-none">
        <div className="glass p-6 rounded-2xl print:shadow-none print:rounded-none print:p-0">
          <AssessmentResultCard 
            likelihood={assessment.analysis.likelihood}
            score={assessment.analysis.score}
            reasons={assessment.analysis.reasons}
            advice={assessment.analysis.advice}
            imageUrl={assessment.imageUrl}
            assessmentDate={assessment.assessmentDate}
            formattedDate={formattedDate}
            onPrint={handlePrint}
          />
          
          <QuestionnaireResponsesCard questionnaire={assessment.questionnaire} />
          
          <DisclaimerCard />
        </div>
      </main>
      
      <AssessmentFooter />
    </div>
  );
};

export default AssessmentDetail;

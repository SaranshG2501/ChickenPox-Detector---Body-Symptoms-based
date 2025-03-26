
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from "sonner";
import { AssessmentResultCard } from '@/components/assessment/AssessmentResultCard';
import { QuestionnaireResponsesCard } from '@/components/assessment/QuestionnaireResponsesCard';
import { DisclaimerCard } from '@/components/assessment/DisclaimerCard';
import { AssessmentHeader } from '@/components/assessment/AssessmentHeader';
import { AssessmentFooter } from '@/components/assessment/AssessmentFooter';
import { Printer } from 'lucide-react';

const AssessmentDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchAssessment = async () => {
      if (!currentUser || !id) {
        setError("Assessment not found");
        setLoading(false);
        return;
      }
      
      try {
        const assessmentRef = doc(db, `users/${currentUser.uid}/assessments`, id);
        const assessmentDoc = await getDoc(assessmentRef);
        
        if (assessmentDoc.exists()) {
          setAssessment({
            id: assessmentDoc.id,
            ...assessmentDoc.data()
          });
        } else {
          setError("Assessment not found");
        }
      } catch (err) {
        console.error("Error fetching assessment:", err);
        setError("Error loading assessment");
        toast.error("Failed to load assessment details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssessment();
  }, [currentUser, id]);
  
  const handlePrint = () => {
    window.print();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading assessment details...</div>
      </div>
    );
  }
  
  if (error || !assessment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl text-red-600 mb-4">{error || "Assessment not found"}</div>
        <button 
          onClick={() => navigate('/history')} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to History
        </button>
      </div>
    );
  }
  
  // Format the date for display
  const assessmentDate = new Date(assessment.timestamp.seconds * 1000);
  const formattedDate = assessmentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <AssessmentHeader date={formattedDate} />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div ref={componentRef} className="space-y-6">
          {/* Assessment Result Card */}
          <AssessmentResultCard
            likelihood={assessment.result.likelihood}
            score={assessment.result.score}
            reasons={assessment.result.reasons}
            advice={assessment.result.advice}
            imageUrl={assessment.imageUrl}
            assessmentDate={assessmentDate.toString()}
            formattedDate={formattedDate}
            onPrint={handlePrint}
          />
          
          {/* Questionnaire Responses Card */}
          <QuestionnaireResponsesCard questionnaire={assessment.questionnaire} />
          
          {/* Disclaimer Card */}
          <DisclaimerCard />
        </div>
      </main>
      
      <AssessmentFooter />
    </div>
  );
};

export default AssessmentDetail;

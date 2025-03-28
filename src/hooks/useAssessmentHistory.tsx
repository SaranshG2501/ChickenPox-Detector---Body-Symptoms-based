
import { useState, useEffect } from 'react';
import { getUserAssessments } from '@/lib/firebase';
import { toast } from 'sonner';
import { AssessmentRecord } from '@/components/history/AssessmentCard';

export const useAssessmentHistory = (currentUserId: string | undefined) => {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!currentUserId) {
        console.warn('No user is currently authenticated.');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching assessments for user ID: ${currentUserId}`);
        const userAssessments = await getUserAssessments(currentUserId);
        console.log('Fetched assessments from Firebase:', userAssessments);
        
        if (!userAssessments || userAssessments.length === 0) {
          console.warn('No assessments found for the current user.');
          setAssessments([]);
          setLoading(false);
          return;
        }
        
        // Map the raw assessments to the expected format with proper type checking
        const formattedAssessments = userAssessments.map(assessment => {
          // Ensure all required fields are present
          const formattedAssessment: AssessmentRecord = {
            id: assessment.id || '',
            questionnaire: assessment.questionnaire || {},
            analysis: {
              likelihood: (assessment.analysis?.likelihood as 'high' | 'medium' | 'low' | 'unknown') || 'unknown',
              score: assessment.analysis?.score || 0,
              reasons: assessment.analysis?.reasons || [],
              advice: assessment.analysis?.advice || '',
            },
            imageUrl: assessment.imageUrl || null,
            assessmentDate: assessment.assessmentDate || new Date().toISOString(),
            createdAt: assessment.createdAt || null
          };
          
          return formattedAssessment;
        });
        
        console.log('Formatted assessments:', formattedAssessments);
        setAssessments(formattedAssessments);
      } catch (error: any) {
        console.error('Error fetching assessments:', error);
        setError(error.message || 'Failed to load your assessment history');
        toast.error('Failed to load your assessment history. Please try again later.');
        // Still set empty assessments array to prevent undefined errors
        setAssessments([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchAssessments();
    } else {
      setLoading(false);
    }
  }, [currentUserId]);

  return { assessments, loading, error };
};

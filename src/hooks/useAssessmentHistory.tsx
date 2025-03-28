
import { useState, useEffect } from 'react';
import { getUserAssessments } from '@/lib/firebase';
import { toast } from 'sonner';
import { AssessmentRecord } from '@/components/history/AssessmentCard';

export const useAssessmentHistory = (currentUserId: string | undefined) => {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!currentUserId) {
        console.warn('No user is currently authenticated.');
        return;
      }
      
      try {
        setLoading(true);
        const userAssessments = await getUserAssessments(currentUserId);
        console.log('Fetched assessments:', userAssessments);
        
        if (!userAssessments || userAssessments.length === 0) {
          console.warn('No assessments found for the current user.');
        }
        
        setAssessments(userAssessments as AssessmentRecord[]);
      } catch (error) {
        console.error('Error fetching assessments:', error);
        toast.error('Failed to load your assessment history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchAssessments();
    }
  }, [currentUserId]);

  return { assessments, loading };
};

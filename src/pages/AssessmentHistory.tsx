
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAssessmentHistory } from '@/hooks/useAssessmentHistory';
import HistoryPageHeader from '@/components/history/HistoryPageHeader';
import HistoryPageFooter from '@/components/history/HistoryPageFooter';
import AssessmentTabContent from '@/components/history/AssessmentTabContent';
import { useEffect } from 'react';

const AssessmentHistory = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { assessments, loading } = useAssessmentHistory(currentUser?.uid);

  useEffect(() => {
    console.log('AssessmentHistory component assessments:', assessments);
    console.log('Current user ID:', currentUser?.uid);
  }, [assessments, currentUser]);

  const viewAssessmentDetails = (id: string) => {
    navigate(`/assessment/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medical-600"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 overflow-hidden -z-10 opacity-50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-medical-100 rounded-full filter blur-3xl opacity-30 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-medical-200 rounded-full filter blur-3xl opacity-30 transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <HistoryPageHeader />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="glass p-6 rounded-2xl">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Assessments</TabsTrigger>
              <TabsTrigger value="high">High Likelihood</TabsTrigger>
              <TabsTrigger value="medium">Medium Likelihood</TabsTrigger>
              <TabsTrigger value="low">Low Likelihood</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <AssessmentTabContent 
                assessments={assessments} 
                onViewDetails={viewAssessmentDetails} 
              />
            </TabsContent>
            
            <TabsContent value="high">
              <AssessmentTabContent 
                assessments={assessments} 
                likelihood="high"
                onViewDetails={viewAssessmentDetails} 
              />
            </TabsContent>
            
            <TabsContent value="medium">
              <AssessmentTabContent 
                assessments={assessments} 
                likelihood="medium"
                onViewDetails={viewAssessmentDetails} 
              />
            </TabsContent>
            
            <TabsContent value="low">
              <AssessmentTabContent 
                assessments={assessments} 
                likelihood="low"
                onViewDetails={viewAssessmentDetails} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <HistoryPageFooter />
    </div>
  );
};

export default AssessmentHistory;

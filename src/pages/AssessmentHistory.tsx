
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAssessmentHistory } from '@/hooks/useAssessmentHistory';
import HistoryPageHeader from '@/components/history/HistoryPageHeader';
import HistoryPageFooter from '@/components/history/HistoryPageFooter';
import AssessmentTabContent from '@/components/history/AssessmentTabContent';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const AssessmentHistory = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { assessments, loading, error } = useAssessmentHistory(currentUser?.uid);

  useEffect(() => {
    console.log('AssessmentHistory component assessments:', assessments);
    console.log('Current user ID:', currentUser?.uid);
    console.log('Is mobile view:', isMobile);
  }, [assessments, currentUser, isMobile]);

  const viewAssessmentDetails = (id: string) => {
    console.log(`Navigating to assessment detail with ID: ${id}`);
    navigate(`/assessment/${id}`);
  };

  // Function to refresh the page when there's an error
  const handleRefresh = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex flex-col">
        <HistoryPageHeader />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-medical-600"></div>
        </div>
        <HistoryPageFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen flex flex-col">
        <HistoryPageHeader />
        <main className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
          <div className="glass p-4 sm:p-6 rounded-xl sm:rounded-2xl">
            <div className="flex flex-col items-center text-center py-6 sm:py-10">
              <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mb-3 sm:mb-4" />
              <h2 className="text-lg sm:text-xl font-medium mb-1 sm:mb-2">Unable to Load Assessments</h2>
              <p className="text-xs sm:text-base text-gray-600 mb-4 sm:mb-6 px-2 sm:px-0">
                There was a problem loading your assessment history. This might be due to a connection issue or a missing Firebase index.
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Button onClick={handleRefresh} size={isMobile ? "sm" : "default"}>
                  <RefreshCw className="h-4 w-4 mr-1 sm:mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => navigate('/')} size={isMobile ? "sm" : "default"}>
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </main>
        <HistoryPageFooter />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 overflow-hidden -z-10 opacity-50">
        <div className="absolute top-0 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-medical-100 rounded-full filter blur-3xl opacity-30 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-medical-200 rounded-full filter blur-3xl opacity-30 transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <HistoryPageHeader />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="glass p-3 sm:p-6 rounded-xl sm:rounded-2xl">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-3 sm:mb-4 grid grid-cols-4 gap-0.5 sm:gap-1 h-8 sm:h-10">
              <TabsTrigger value="all" className="text-[10px] sm:text-xs py-1 sm:py-1.5">All</TabsTrigger>
              <TabsTrigger value="high" className="text-[10px] sm:text-xs py-1 sm:py-1.5">High Risk</TabsTrigger>
              <TabsTrigger value="medium" className="text-[10px] sm:text-xs py-1 sm:py-1.5">Medium</TabsTrigger>
              <TabsTrigger value="low" className="text-[10px] sm:text-xs py-1 sm:py-1.5">Low Risk</TabsTrigger>
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

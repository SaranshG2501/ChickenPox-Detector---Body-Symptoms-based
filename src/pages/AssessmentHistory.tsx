import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserAssessments } from '@/lib/firebase';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  CheckCircle, 
  HelpCircle, 
  CalendarIcon, 
  Clock, 
  ArrowLeft,
  Eye 
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AssessmentRecord {
  id: string;
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

const AssessmentHistory = () => {
  const { currentUser } = useAuth();
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!currentUser) {
        console.warn('No user is currently authenticated.');
        return;
      }
      
      try {
        setLoading(true);
        const userAssessments = await getUserAssessments(currentUser.uid);
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

    if (currentUser) {
      fetchAssessments();
    }
  }, [currentUser]);

  const getLikelihoodBadge = (likelihood: 'high' | 'medium' | 'low' | 'unknown') => {
    const badgeStyles = {
      high: { bg: 'bg-red-500', icon: <AlertCircle className="h-4 w-4 mr-1" /> },
      medium: { bg: 'bg-amber-500', icon: <HelpCircle className="h-4 w-4 mr-1" /> },
      low: { bg: 'bg-green-500', icon: <CheckCircle className="h-4 w-4 mr-1" /> },
      unknown: { bg: 'bg-blue-500', icon: <HelpCircle className="h-4 w-4 mr-1" /> }
    };

    const { bg, icon } = badgeStyles[likelihood];
    return (
      <Badge className={`${bg} flex items-center`}>
        {icon}
        {likelihood === 'high' ? 'High' : likelihood === 'medium' ? 'Medium' : likelihood === 'low' ? 'Low' : 'Unknown'} Likelihood
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPP');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'p');
    } catch (error) {
      return '';
    }
  };

  const viewAssessmentDetails = (id: string) => {
    navigate(`/assessment/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className ="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medical-600"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 overflow-hidden -z-10 opacity-50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-medical-100 rounded-full filter blur-3xl opacity-30 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-medical-200 rounded-full filter blur-3xl opacity-30 transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass px-6 py-4 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  className="mr-2" 
                  onClick={() => navigate('/')}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <h1 className="text-2xl sm:text-3xl font-medium">
                  <span className="text-medical-700">Assessment</span> History
                </h1>
              </div>
            </div>
            <p className="mt-2 text-gray-600">
              View your past chicken pox assessments and track changes over time
            </p>
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="glass p-6 rounded-2xl">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Assessments</TabsTrigger>
              <TabsTrigger value="high">High Likelihood</TabsTrigger>
              <TabsTrigger value="medium">Medium Likelihood</TabsTrigger>
              <TabsTrigger value="low">Low Likelihood</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {assessments.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-gray-500">No assessments found. Start your first assessment now!</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate('/')}
                    >
                      Start New Assessment
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                assessments.map((assessment) => (
                  <AssessmentCard 
                    key={assessment.id} 
                    assessment={assessment} 
                    onViewDetails={viewAssessmentDetails}
                    formatDate={formatDate}
                    formatTime={formatTime}
                    getLikelihoodBadge={getLikelihoodBadge}
                  />
                ))
              )}
            </TabsContent>
            
            <TabsContent value="high" className="space-y-4">
              {assessments.filter(a => a.analysis.likelihood === 'high').map((assessment) => (
                <AssessmentCard 
                  key={assessment.id} 
                  assessment={assessment} 
                  onViewDetails={viewAssessmentDetails}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  getLikelihoodBadge={getLikelihoodBadge}
                />
              ))}
            </TabsContent>
            
            <TabsContent value="medium" className="space-y-4">
              {assessments.filter(a => a.analysis.likelihood === 'medium').map((assessment) => (
                <AssessmentCard 
                  key={assessment.id} 
                  assessment={assessment} 
                  onViewDetails={viewAssessmentDetails}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  getLikelihoodBadge={getLikelihoodBadge}
                />
              ))}
            </TabsContent>
            
            <TabsContent value="low" className="space-y-4">
              {assessments.filter(a => a.analysis.likelihood === 'low').map((assessment) => (
                <AssessmentCard 
                  key={assessment.id} 
                  assessment={assessment} 
                  onViewDetails={viewAssessmentDetails}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  getLikelihoodBadge={getLikelihoodBadge}
                />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="w-full py-4 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-sm text-gray-500">
            <p>This is a demonstration application. Always consult a healthcare professional for medical advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface AssessmentCardProps {
  assessment: AssessmentRecord;
  onViewDetails: (id: string) => void;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
  getLikelihoodBadge: (likelihood: 'high' | 'medium' | 'low' | 'unknown') => React.ReactNode;
}

const AssessmentCard = ({ 
  assessment, 
  onViewDetails,
  formatDate,
  formatTime,
  getLikelihoodBadge
}: AssessmentCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Assessment Report</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {formatDate(assessment.assessmentDate)}
              <span className="mx-1">•</span>
              <Clock className="h-4 w-4 mr-1" />
              {formatTime(assessment.assessmentDate)}
            </CardDescription>
          </div>
          {getLikelihoodBadge(assessment.analysis.likelihood)}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex gap-4">
          {assessment.imageUrl && (
            <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded overflow-hidden border">
              <img 
                src={assessment.imageUrl} 
                alt="Skin condition" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h4 className="font-medium mb-1">Key Factors:</h4>
            <ul className="list-disc pl-5 text-sm space-y-0.5">
              {assessment.analysis.reasons.slice(0, 3).map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
              {assessment.analysis.reasons.length > 3 && (
                <li className="text-gray-500">+ {assessment.analysis.reasons.length - 3} more factors</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onViewDetails(assessment.id)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AssessmentHistory;

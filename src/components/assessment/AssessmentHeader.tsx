
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AssessmentHeaderProps {
  date: string;
}

export const AssessmentHeader = ({ date }: AssessmentHeaderProps) => {
  const navigate = useNavigate();
  
  return (
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
            Detailed report from {date}
          </p>
        </div>
      </div>
    </header>
  );
};


import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const HistoryPageHeader = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <header className="w-full py-4 sm:py-6 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="glass px-3 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                className="mr-1 sm:mr-2 h-8 sm:h-10 w-8 sm:w-auto px-1 sm:px-3" 
                onClick={() => navigate('/')}
                size={isMobile ? "sm" : "default"}
              >
                <ArrowLeft className="h-4 w-4 sm:mr-1" />
                {!isMobile && <span>Back</span>}
              </Button>
              <h1 className="text-lg sm:text-3xl font-medium">
                <span className="text-medical-700">Assessment</span> History
              </h1>
            </div>
          </div>
          <p className="mt-1 sm:mt-2 text-gray-600 text-xs sm:text-base">
            View your past chicken pox assessments and track changes over time
          </p>
        </div>
      </div>
    </header>
  );
};

export default HistoryPageHeader;

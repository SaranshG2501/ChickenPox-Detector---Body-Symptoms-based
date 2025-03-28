
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HistoryPageHeader = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default HistoryPageHeader;

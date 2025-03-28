
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const EmptyHistoryCard = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default EmptyHistoryCard;

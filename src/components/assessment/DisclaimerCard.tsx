
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DisclaimerCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Important Disclaimer</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700">
          This application provides a preliminary assessment only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this application.
        </p>
      </CardContent>
    </Card>
  );
};

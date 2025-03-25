
import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import SymptomsQuestionnaire, { QuestionnaireResults } from '@/components/SymptomsQuestionnaire';
import ResultDisplay from '@/components/ResultDisplay';
import LogoutButton from '@/components/LogoutButton';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';

enum ScreenState {
  UPLOAD,
  QUESTIONNAIRE,
  RESULTS
}

const Index = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<ScreenState>(ScreenState.UPLOAD);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [questionnaireResults, setQuestionnaireResults] = useState<QuestionnaireResults | null>(null);

  const handleImageUploaded = (image: File) => {
    setUploadedImage(image);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(image);
    
    // Show toast and advance to questionnaire
    toast("Image uploaded successfully! Please answer a few questions about your symptoms.");
    
    setTimeout(() => {
      setCurrentScreen(ScreenState.QUESTIONNAIRE);
    }, 1200);
  };

  const handleQuestionnaireComplete = (results: QuestionnaireResults) => {
    setQuestionnaireResults(results);
    setCurrentScreen(ScreenState.RESULTS);
    
    toast("Analysis complete. Reviewing your results...");
  };

  const handleRestart = () => {
    setCurrentScreen(ScreenState.UPLOAD);
    setUploadedImage(null);
    setImagePreview(null);
    setQuestionnaireResults(null);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case ScreenState.UPLOAD:
        return <ImageUpload onImageUploaded={handleImageUploaded} />;
      case ScreenState.QUESTIONNAIRE:
        return <SymptomsQuestionnaire onComplete={handleQuestionnaireComplete} />;
      case ScreenState.RESULTS:
        return <ResultDisplay 
          results={questionnaireResults!} 
          imagePreview={imagePreview}
          imageFile={uploadedImage}
          onRestart={handleRestart}
        />;
      default:
        return <ImageUpload onImageUploaded={handleImageUploaded} />;
    }
  };

  // Background circles for design
  const renderBackgroundElements = () => (
    <div className="absolute inset-0 overflow-hidden -z-10 opacity-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-medical-100 rounded-full filter blur-3xl opacity-30 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-medical-200 rounded-full filter blur-3xl opacity-30 transform translate-x-1/2 translate-y-1/2"></div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col">
      {renderBackgroundElements()}
      
      {/* Header */}
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass px-6 py-4 rounded-2xl">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-medium">
                <span className="text-medical-700">Chicken Pox</span> Symptom Assessment
              </h1>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/history')}
                  className="hidden sm:flex"
                >
                  <History className="mr-2 h-4 w-4" />
                  History
                </Button>
                <span className="text-sm text-gray-600 hidden sm:inline">
                  Welcome, {currentUser?.displayName || 'User'}
                </span>
                <LogoutButton />
              </div>
            </div>
            <p className="mt-2 text-gray-600">
              Upload an image of the affected area and answer a few questions for a preliminary assessment
            </p>
            <div className="mt-2 sm:hidden">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/history')}
                className="w-full"
              >
                <History className="mr-2 h-4 w-4" />
                View Assessment History
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="glass p-6 rounded-2xl">
          {renderCurrentScreen()}
        </div>
      </main>
      
      {/* Footer */}
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

export default Index;


import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import SymptomsQuestionnaire, { QuestionnaireResults } from "@/components/SymptomsQuestionnaire";
import ResultDisplay from "@/components/ResultDisplay";
import LogoutButton from "@/components/LogoutButton";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

enum ScreenState {
  UPLOAD,
  QUESTIONNAIRE,
  RESULTS
}

const Index = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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
    <div className="absolute inset-0 overflow-hidden -z-10 opacity-30">
      <div className="absolute top-0 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-green-100 rounded-full filter blur-3xl opacity-30 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-green-200 rounded-full filter blur-3xl opacity-30 transform translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-64 sm:w-80 h-64 sm:h-80 bg-green-300 rounded-full filter blur-3xl opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      {renderBackgroundElements()}
      
      <header className="w-full py-4 sm:py-6 px-3 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h1 className="text-xl sm:text-4xl font-medium text-gray-800">
                <span className="text-gray-800">Chicken Pox</span> <span className="text-gray-600">Symptoms Assessment</span>
              </h1>
              <div className="flex items-center gap-2">
              <Button 
  variant="outline" 
  size="sm" 
  onClick={() => navigate('/history')}
  className={`flex items-center text-gray-800 hover:text-black border-gray-300 hover:bg-gray-200 h-8 sm:h-9 ${isMobile ? 'px-2 sm:px-3' : 'px-3'}`}
>
  <History className="h-4 w-4 mr-0 sm:mr-2" />
  <span className={isMobile ? "sr-only sm:inline" : ""}>History</span>
</Button>
                <LogoutButton />
              </div>
            </div>
            <p className="mt-2 sm:mt-3 text-gray-800 text-center font-semibold text-base sm:text-xl px-1 sm:px-2">
              Welcome, <span>{currentUser?.displayName}</span>!
            </p>
            <p className="mt-1 sm:mt-2 text-gray-600 text-center text-xs sm:text-base">
              Upload an image of the affected area and answer a few questions for a preliminary assessment.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6">
        <div className="w-full max-w-3xl"> 
          <div className="glass rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 border border-white/20 backdrop-blur-lg bg-white/10">
            {renderCurrentScreen()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

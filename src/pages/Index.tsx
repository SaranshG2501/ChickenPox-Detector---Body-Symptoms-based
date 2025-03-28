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

enum ScreenState {
  UPLOAD,
  QUESTIONNAIRE,
  RESULTS
}

const Index = () => {
  const { currentUser  } = useAuth();
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
    <div className="absolute inset-0 overflow-hidden -z-10 opacity-30">
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-100 rounded-full filter blur-3xl opacity-30 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-200 rounded-full filter blur-3xl opacity-30 transform translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-green-300 rounded-full filter blur-3xl opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      {renderBackgroundElements()}
      
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mr-2">
              <h1 className="text-2xl sm:text-4xl font-medium text-gray-800">
                <span className="text-gray-800">Chicken Pox</span> <span className="text-gray-600">Symptoms Assessment</span>
              </h1>
              <div className="flex items-center gap-3 mx-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/history')}
                  className=" text-gray-800 hover:text-black border-gray-600 hover:bg-gray-200"
                >
                  <History className="mr-2" />
                  View History
                </Button>
                <LogoutButton />
              </div>
            </div>
            <p className="mt-3 text-gray-800 text-center font-semibold text-xl px-2 ">
  Welcome, <span>{currentUser ?.displayName}</span>!
</p>
            <p className="mt-2 text-gray-600 text-center">
              Upload an image of the affected area and answer a few questions for a preliminary assessment.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl"> {/* Width adjustment */}
          <div className="glass rounded-2xl shadow-xl p-8 border border-white/20 backdrop-blur-lg bg-white/10">
            {renderCurrentScreen()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
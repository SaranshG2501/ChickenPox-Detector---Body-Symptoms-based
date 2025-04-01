
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, RefreshCw, Save, Check } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";

interface ResultActionsProps {
  onRestart: () => void;
  onSave: () => void;
  isSaving: boolean;
  isSaved: boolean;
}

const ResultActions = ({ onRestart, onSave, isSaving, isSaved }: ResultActionsProps) => {
  const isMobile = useIsMobile();

  return (
    <CardFooter className="flex flex-col sm:flex-row justify-between border-t p-3 sm:p-4 gap-2 sm:gap-0">
      <div className="flex gap-2 w-full sm:w-auto">
        <Button 
          onClick={onRestart} 
          className="text-gray-800 py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg hover:bg-gray-300 text-xs sm:text-sm flex-1 sm:flex-initial"
          size={isMobile ? "sm" : "default"}
        >
          <RefreshCw className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          {isMobile ? "New" : "Start New Assessment"}
        </Button>
        <Button 
          variant={isSaved ? "outline" : "default"} 
          onClick={onSave} 
          disabled={isSaving || isSaved}
          className={`${isSaved ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800" : "text-gray-800 hover:bg-gray-300"} py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm flex-1 sm:flex-initial`}
          size={isMobile ? "sm" : "default"}
        >
          {isSaved ? (
            <>
              <Check className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              {isMobile ? "Saved" : "Result Saved"}
            </>
          ) : (
            <>
              <Save className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              {isSaving ? (isMobile ? 'Saving...' : 'Saving Results...') : (isMobile ? 'Save' : 'Save Results')}
            </>
          )}
        </Button>
      </div>
      <Button 
        className="bg-gray-200 text-gray-800 py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg hover:bg-gray-300 mt-2 sm:mt-0 text-xs sm:text-sm w-full sm:w-auto"
        size={isMobile ? "sm" : "default"}
      >
        <ExternalLink className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
        {isMobile ? "Consult Doctor" : "Consult Doctor"}
      </Button>
    </CardFooter>
  );
};

export default ResultActions;

import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, RefreshCw, Save, Check } from 'lucide-react';

interface ResultActionsProps {
  onRestart: () => void;
  onSave: () => void;
  isSaving: boolean;
  isSaved: boolean;
}

const ResultActions = ({ onRestart, onSave, isSaving, isSaved }: ResultActionsProps) => {
  return (
    <CardFooter className="flex justify-between border-t p-4">
      <div className="flex gap-2">
        <Button 
          onClick={onRestart} 
          className=" text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Start New Assessment
        </Button>
        <Button 
          variant={isSaved ? "outline" : "default"} 
          onClick={onSave} 
          disabled={isSaving || isSaved}
          className={isSaved ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800" : " text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"}
        >
          {isSaved ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Result Saved
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Results'}
            </>
          )}
        </Button>
      </div>
      <Button className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300">
        <ExternalLink className="mr-2 h-4 w-4" />
        Consult Doctor
      </Button>
    </CardFooter>
  );
};

export default ResultActions;
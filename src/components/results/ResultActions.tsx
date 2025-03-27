
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, RefreshCw, Save } from 'lucide-react';

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
        <Button variant="outline" onClick={onRestart}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Start New Assessment
        </Button>
        <Button 
          variant="outline" 
          onClick={onSave} 
          disabled={isSaving || isSaved}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save Results'}
        </Button>
      </div>
      <Button>
        <ExternalLink className="mr-2 h-4 w-4" />
        Consult Doctor
      </Button>
    </CardFooter>
  );
};

export default ResultActions;


import React from 'react';
import { AssessmentRecord } from './AssessmentCard';
import AssessmentCard from './AssessmentCard';
import EmptyHistoryCard from './EmptyHistoryCard';
import { formatDate, formatTime } from '@/utils/dateFormatUtils';
import { getLikelihoodBadge } from './LikelihoodBadgeUtils';

interface AssessmentTabContentProps {
  assessments: AssessmentRecord[];
  likelihood?: 'high' | 'medium' | 'low' | 'unknown';
  onViewDetails: (id: string) => void;
}

const AssessmentTabContent: React.FC<AssessmentTabContentProps> = ({ 
  assessments, 
  likelihood, 
  onViewDetails 
}) => {
  // Filter assessments by likelihood if specified
  const filteredAssessments = likelihood 
    ? assessments.filter(a => a.analysis.likelihood === likelihood)
    : assessments;

  if (filteredAssessments.length === 0) {
    return <EmptyHistoryCard />;
  }

  return (
    <div className="space-y-4">
      {filteredAssessments.map((assessment) => (
        <AssessmentCard 
          key={assessment.id} 
          assessment={assessment} 
          onViewDetails={onViewDetails}
          formatDate={formatDate}
          formatTime={formatTime}
          getLikelihoodBadge={getLikelihoodBadge}
        />
      ))}
    </div>
  );
};

export default AssessmentTabContent;

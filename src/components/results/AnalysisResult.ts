
export interface AnalysisResult {
  likelihood: 'high' | 'medium' | 'low' | 'unknown';
  score: number;
  reasons: string[];
  advice: string;
  aiConfidence?: number;
  alternativeDiagnoses?: string[];
}

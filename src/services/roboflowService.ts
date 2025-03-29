
import axios from 'axios';

export interface RoboflowResponse {
  predictions: Array<{
    class: string;
    confidence: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }>;
  time: number;
  image: {
    width: number;
    height: number;
  };
}

export async function analyzeImageWithRoboflow(imageBase64: string): Promise<RoboflowResponse> {
  try {
    // Remove data URL prefix if present
    const base64Image = imageBase64.includes('base64,') 
      ? imageBase64.split('base64,')[1] 
      : imageBase64;
    
    const response = await axios({
      method: "POST",
      url: "https://detect.roboflow.com/chicken-pox/1",
      params: {
        api_key: "nHfr6n14LpthNDMn75aF",
        image: base64Image
      }
    });
    
    console.log("Roboflow API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error analyzing image with Roboflow:", error);
    throw error;
  }
}

export function getChickenpoxConfidence(data: RoboflowResponse): number {
  // Find chickenpox class predictions
  const chickenpoxPredictions = data.predictions.filter(
    pred => pred.class.toLowerCase().includes('chicken') || 
           pred.class.toLowerCase().includes('pox')
  );
  
  // If no chickenpox predictions, return 0
  if (chickenpoxPredictions.length === 0) return 0;
  
  // Return the highest confidence among chickenpox predictions
  return Math.max(...chickenpoxPredictions.map(pred => pred.confidence)) * 100;
}

export function getPossibleConditions(data: RoboflowResponse): string[] {
  // Extract unique classes from predictions that are not chickenpox
  const conditions = data.predictions
    .filter(pred => !(pred.class.toLowerCase().includes('chicken') || 
                     pred.class.toLowerCase().includes('pox')))
    .map(pred => pred.class);
  
  // Return unique conditions
  return [...new Set(conditions)];
}

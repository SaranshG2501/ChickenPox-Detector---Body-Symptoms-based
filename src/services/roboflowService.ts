
import { toast } from "sonner";

export interface RoboflowResponse {
  inference_id: string;
  time: number;
  image: {
    width: number;
    height: number;
  };
  predictions: {
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
    class: string;
    class_id: number;
    detection_id: string;
  }[];
}

// Hardcoded API key for demo purposes
// In production, this should be secured properly through environment variables
const ROBOFLOW_API_KEY = "0oGS7PsRgRK8rPSfALhm";
const MODEL_ID = "chicken-pox/1";
const ENDPOINT = `https://detect.roboflow.com/${MODEL_ID}`;

export const analyzeImageWithRoboflow = async (imageData: string): Promise<RoboflowResponse> => {
  try {
    console.info("Sending image to Roboflow API...");
    
    // Format the image data (remove data:image/jpeg;base64, prefix if it exists)
    const formattedImageData = imageData.includes('base64,') 
      ? imageData.split('base64,')[1] 
      : imageData;
    
    console.log("Calling Roboflow API at:", ENDPOINT);
    
    const response = await fetch(`${ENDPOINT}?api_key=${ROBOFLOW_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formattedImageData
    });
    
    console.log("Roboflow API response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Roboflow API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Image analysis failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json() as RoboflowResponse;
    
    // Log all conditions the model can predict
    console.info("Roboflow API response received:", data);
    console.log("Classes detected by model:", data.predictions.map(p => p.class));
    
    return data;
  } catch (error: any) {
    // More detailed error logging
    console.error("Error calling Roboflow:", error);
    const errorMessage = error?.message || "Unknown error occurred during image analysis";
    toast.error("There was an error analyzing your image. Results will be based only on your symptoms.");
    
    // Return a mock response instead of throwing an error
    // This allows the app to continue even if the API call fails
    return {
      inference_id: "error",
      time: 0,
      image: {
        width: 0,
        height: 0
      },
      predictions: []
    };
  }
};

export const getPossibleConditions = (response: RoboflowResponse): string[] => {
  if (!response || !response.predictions || !Array.isArray(response.predictions)) {
    return [];
  }
  
  // Extract all predicted classes that are not related to chickenpox
  return response.predictions
    .filter(prediction => !prediction.class.toLowerCase().includes('chicken') && !prediction.class.toLowerCase().includes('pox'))
    .map(prediction => prediction.class);
};

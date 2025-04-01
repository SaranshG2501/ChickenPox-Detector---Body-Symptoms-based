
import { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Camera, X } from 'lucide-react';
import { toast } from "sonner";

interface ImageUploadProps {
  onImageUploaded: (image: File) => void;
}

const ImageUpload = ({ onImageUploaded }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Validate file is an image
    if (!file.type.match('image.*')) {
      toast.error("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image is too large. Maximum size is 10MB.");
      return;
    }

    setIsLoading(true);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      setIsLoading(false);
      
      // Call the callback to pass image to parent
      onImageUploaded(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger click on hidden file input
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Capture image from camera (mobile devices)
  const handleCaptureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*';
      fileInputRef.current.capture = 'environment';
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="w-full overflow-hidden animate-fade-in shadow-md">
      <CardContent className="p-4 sm:p-6">
        <div
          className={`upload-area relative flex flex-col items-center justify-center p-4 sm:p-8 border-2 border-dashed rounded-lg transition-all
            ${isDragging ? 'border-black bg-green-100' : 'border-gray-200 hover:border-gray-400'}
            ${preview ? 'border-opacity-0' : 'border-opacity-100'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-10 h-10 border-4 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-sm text-gray-500">Processing image...</p>
            </div>
          ) : preview ? (
            <div className="relative w-full">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-auto max-h-64 sm:max-h-96 object-contain rounded-md animate-fade-in" 
              />
              <Button 
                variant="secondary" 
                size="icon" 
                className="absolute top-2 right-2 bg-white/80 hover:bg-white shadow-sm"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4 sm:mb-5 p-4 sm:p-5 bg-gray-100 text-gray-700 rounded-full shadow-lg"> 
                <Upload className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <h3 className="mb-2 text-base sm:text-lg font-medium text-gray-800">Upload Skin Image</h3>
              <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-center text-gray-500 max-w-xs px-2">
                Drag and drop your image here, or use the buttons below
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button 
                  className="w-full sm:w-auto button-hover-effect px-4 py-2 sm:py-3 text-sm sm:text-base"
                  onClick={handleUploadClick}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                <Button 
                  className="w-full sm:w-auto button-hover-effect px-4 py-2 sm:py-3 text-sm sm:text-base mt-2 sm:mt-0" 
                  onClick={handleCaptureClick}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
              </div>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUpload;

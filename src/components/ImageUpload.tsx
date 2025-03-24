
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Camera, X } from 'lucide-react';
import { toast } from "@/components/ui/sonner";

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
    <Card className="w-full overflow-hidden animate-fade-in">
      <CardContent className="p-6">
        <div
          className={`upload-area relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-all
            ${isDragging ? 'border-medical-600 bg-medical-100' : 'border-gray-200 hover:border-medical-400'}
            ${preview ? 'border-opacity-0' : 'border-opacity-100'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-10 h-10 border-4 border-medical-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-sm text-gray-500">Processing image...</p>
            </div>
          ) : preview ? (
            <div className="relative w-full">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full max-h-96 object-contain rounded-md animate-fade-in" 
              />
              <Button 
                variant="secondary" 
                size="icon" 
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4 p-4 bg-medical-100 text-medical-600 rounded-full">
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Upload skin image</h3>
              <p className="mb-6 text-sm text-center text-gray-500 max-w-xs">
                Drag and drop your image here, or click to select a file
              </p>
              <div className="flex gap-3">
                <Button 
                  className="button-hover-effect"
                  onClick={handleUploadClick}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
                <Button 
                  variant="outline" 
                  className="button-hover-effect"
                  onClick={handleCaptureClick}
                >
                  <Camera className="mr-2 h-4 w-4" />
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

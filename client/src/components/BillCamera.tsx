
import React, { useRef, useState, useCallback } from 'react';
import { Camera, ImageIcon, Loader2, FileUp, CameraOff, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface BillCameraProps {
  onCapture: (imageUrl: string) => void;
  onAmountDetected: (amount: number) => void;
}

export function BillCamera({ onCapture, onAmountDetected }: BillCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedAmount, setDetectedAmount] = useState<number | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      setCameraError(null);
      if (videoRef.current) {
        const constraints = {
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        toast.success('Camera started');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Could not access camera. Please check permissions or try file upload instead.');
      toast.error('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsStreaming(false);
    }
  }, []);

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL
      const imageUrl = canvas.toDataURL('image/png');
      setCapturedImage(imageUrl);
      
      // Stop the camera after capturing
      stopCamera();
      
      // Pass the image URL to parent component
      onCapture(imageUrl);
      
      // Process the image
      processBillImage(imageUrl);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      if (imageUrl) {
        setCapturedImage(imageUrl);
        onCapture(imageUrl);
        processBillImage(imageUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const processBillImage = async (imageUrl: string) => {
    setIsProcessing(true);
    
    try {
      // In a real app, we would send the image to a backend for OCR processing
      // Instead, we'll simulate it with a delay and random amount
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate random amount between $10 and $200
      const amount = Math.floor(Math.random() * 190) + 10;
      
      setDetectedAmount(amount);
      onAmountDetected(amount);
      toast.success(`Amount detected: $${amount.toFixed(2)}`);
    } catch (error) {
      console.error('Error processing bill image:', error);
      toast.error('Failed to process bill image');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetCamera = () => {
    setCapturedImage(null);
    setDetectedAmount(null);
    setCameraError(null);
    startCamera();
  };

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <div className="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden relative mb-4">
        {/* Initial state - no camera, no image */}
        {!isStreaming && !capturedImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-100 p-6">
            {cameraError ? (
              <div className="text-center mb-4">
                <CameraOff className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <p className="text-red-500 mb-4">{cameraError}</p>
              </div>
            ) : (
              <Camera className="w-16 h-16 text-gray-400 mb-2" />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xs">
              <Button onClick={startCamera} className="bg-pocket-purple hover:bg-pocket-vivid">
                <Camera className="mr-2 h-4 w-4" /> Use Camera
              </Button>
              <Button onClick={triggerFileUpload} variant="outline" className="border-pocket-purple text-pocket-purple hover:bg-pocket-softPurple">
                <Upload className="mr-2 h-4 w-4" /> Upload File
              </Button>
            </div>
          </div>
        )}
        
        {/* Camera view */}
        {isStreaming && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-full"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            <motion.div 
              className="absolute inset-0 border-2 border-pocket-purple rounded-lg pointer-events-none"
              animate={{ 
                boxShadow: ['0 0 0 0 rgba(155, 135, 245, 0)', '0 0 0 4px rgba(155, 135, 245, 0.3)'],
                scale: [1, 1.02, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity
              }}
            />
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              <Button onClick={captureImage} className="bg-pocket-purple hover:bg-pocket-vivid">
                Capture Bill
              </Button>
              <Button onClick={stopCamera} variant="outline">
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
        
        {/* Captured/uploaded image view */}
        {capturedImage && (
          <div className="relative w-full h-full">
            <img 
              src={capturedImage} 
              alt="Captured bill" 
              className="w-full h-full object-cover"
            />
            
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin mb-2" />
                  <p>Processing bill...</p>
                </div>
              </div>
            )}
            
            {detectedAmount !== null && !isProcessing && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-4 right-4 bg-pocket-purple text-white px-4 py-2 rounded-full font-bold"
              >
                ${detectedAmount.toFixed(2)}
              </motion.div>
            )}
          </div>
        )}
      </div>
      
      {/* Hidden file input */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />
      
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Action buttons for captured image */}
      {capturedImage && (
        <div className="flex gap-2">
          <Button onClick={() => {
            setCapturedImage(null);
            setDetectedAmount(null);
            setCameraError(null);
          }} variant="outline">
            Take New Photo
          </Button>
          {detectedAmount !== null && (
            <Button 
              onClick={() => {
                toast.success('Amount added to transaction');
                setCapturedImage(null);
                setDetectedAmount(null);
              }}
              className="bg-pocket-purple hover:bg-pocket-vivid"
            >
              Use Amount (${detectedAmount.toFixed(2)})
            </Button>
          )}
        </div>
      )}
    </div>
  );
}


import { useState, useEffect } from 'react';

interface DeviceCapabilities {
  hasCamera: boolean;
  isMobile: boolean;
  supportsFileUpload: boolean;
}

export const useDeviceDetection = (): DeviceCapabilities => {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    hasCamera: false,
    isMobile: false,
    supportsFileUpload: true
  });

  useEffect(() => {
    // Check if device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Check if camera is available
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(device => device.kind === 'videoinput');
        
        setCapabilities({
          hasCamera,
          isMobile,
          supportsFileUpload: true // Modern browsers all support file upload
        });
      } catch (error) {
        console.error('Error checking camera:', error);
        setCapabilities({
          hasCamera: false,
          isMobile,
          supportsFileUpload: true
        });
      }
    };

    // Try to check camera if supported
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      checkCamera();
    } else {
      setCapabilities({
        hasCamera: false,
        isMobile,
        supportsFileUpload: true
      });
    }
  }, []);

  return capabilities;
};

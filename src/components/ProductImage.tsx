import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { ImageOff, Loader2 } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({ src, alt, className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn("relative w-full h-full bg-gray-50 flex items-center justify-center overflow-hidden", className)}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
        </div>
      )}
      
      {hasError ? (
        <div className="flex flex-col items-center justify-center text-gray-300 gap-2">
          <ImageOff size={32} />
          <span className="text-[10px] uppercase font-bold tracking-widest">Image Unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            isLoading ? "scale-105 blur-sm opacity-0" : "scale-100 blur-0 opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
};

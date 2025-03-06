'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  fill?: boolean;
  quality?: number;
  caption?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * OptimizedImage component for better performance and SEO
 * Extends Next.js Image with additional features like captions and fallbacks
 * Improves Core Web Vitals by optimizing LCP and CLS
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  quality = 85,
  caption,
  loading = 'lazy',
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Reset error state if src changes
  useEffect(() => {
    setError(false);
  }, [src]);

  // Determine if the image is external (not from our domain)
  const isExternal = src.startsWith('http') && !src.includes('healthcheck.info');

  // Placeholder image for errors
  const fallbackSrc = '/images/placeholder.jpg';

  return (
    <figure className={`relative ${className}`}>
      <div
        className={`overflow-hidden rounded-lg ${
          !loaded && !error ? 'bg-gray-200 animate-pulse' : ''
        }`}
        style={
          !fill && width && height
            ? { aspectRatio: `${width}/${height}` }
            : undefined
        }
      >
        {!error ? (
          <Image
            src={src}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            priority={priority}
            quality={quality}
            sizes={sizes}
            loading={loading}
            className={`rounded-lg transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            unoptimized={isExternal} // Don't optimize external images
          />
        ) : (
          <div className="relative">
            <Image
              src={fallbackSrc}
              alt="Image could not be loaded"
              width={fill ? undefined : width}
              height={fill ? undefined : height}
              fill={fill}
              sizes={sizes}
              className="rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm p-2 text-center">
              Image could not be loaded
            </div>
          </div>
        )}
      </div>
      
      {caption && (
        <figcaption className="text-sm text-gray-500 mt-2 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Helper function to generate image metadata for SEO
 * Use this in page metadata for important images
 */
export function generateImageMetadata(
  src: string,
  alt: string,
  width: number,
  height: number
) {
  // Ensure src is an absolute URL
  const absoluteSrc = src.startsWith('http')
    ? src
    : `https://www.healthcheck.info${src.startsWith('/') ? '' : '/'}${src}`;

  return {
    url: absoluteSrc,
    width,
    height,
    alt,
  };
}

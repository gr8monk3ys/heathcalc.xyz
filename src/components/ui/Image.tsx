'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import NextImage from 'next/image';
import { generateImageMetadata } from '@/utils/seo';
import { reserveSpaceFor, preloadImage } from '@/utils/performance';
import { cn } from '@/lib/utils';

export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  className?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty' | 'shimmer';
  blurDataUrl?: string;
  caption?: string;
  addMetadata?: boolean;
  onLoad?: () => void;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  responsive?: boolean;
  fallbackSrc?: string;
}

/**
 * Enhanced Image component that combines the best features of Next.js Image
 * with additional optimizations for performance, accessibility, and SEO
 */
export default function Image({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  quality = 85,
  className = '',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  loading = 'lazy',
  placeholder = 'empty',
  blurDataUrl,
  caption,
  addMetadata = true,
  onLoad,
  objectFit = 'cover',
  objectPosition = 'center',
  responsive = true,
  fallbackSrc = '/images/placeholder.jpg',
}: ImageProps): React.JSX.Element {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  
  // Determine if the image is external (not from our domain)
  const isExternal = src.startsWith('http') && !src.includes('healthcheck.com');
  
  // Generate image metadata for structured data
  const imageMetadata = useMemo(() => {
    return addMetadata ? generateImageMetadata(src, alt, width || 0, height || 0) : null;
  }, [src, alt, width, height, addMetadata]);
  
  // Generate placeholder data URL if needed
  const placeholderUrl = useMemo(() => {
    if (blurDataUrl) return blurDataUrl;
    if (placeholder === 'shimmer') return generateShimmerDataURL(width, height);
    if (placeholder === 'blur') return generateBlurDataURL(width, height);
    return undefined;
  }, [blurDataUrl, placeholder, width, height]);
  
  // Preload priority images
  useEffect(() => {
    if (priority && typeof window !== 'undefined') {
      preloadImage(src, true);
    }
  }, [src, priority]);
  
  // Set up intersection observer to detect when image is in viewport
  useEffect(() => {
    if (!imageRef.current || priority) {
      setIsInView(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px', // Start loading when image is 200px from viewport
        threshold: 0.01,
      }
    );
    
    observer.observe(imageRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [priority]);
  
  // Reserve space for the image to prevent layout shifts
  useEffect(() => {
    if (imageRef.current && width && height) {
      reserveSpaceFor(imageRef.current, width, height);
    }
  }, [width, height]);
  
  // Handle image load
  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad();
    }
  };
  
  // Handle image error
  const handleImageError = () => {
    setHasError(true);
    console.error(`Failed to load image: ${src}`);
  };
  
  // Determine aspect ratio for responsive sizing
  const aspectRatio = width && height ? `${width}/${height}` : undefined;
  
  // Responsive image sizes based on breakpoints
  const responsiveSizes = responsive
    ? sizes
    : undefined;
  
  return (
    <figure className={cn('relative', className)}>
      <div
        ref={imageRef}
        className={cn(
          'overflow-hidden rounded-lg',
          !isLoaded && !hasError && 'bg-gray-200',
          placeholder === 'shimmer' && !isLoaded && 'animate-pulse'
        )}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        {/* Blur placeholder */}
        {placeholderUrl && !isLoaded && !hasError && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm scale-105 transition-opacity duration-500"
            style={{
              backgroundImage: `url(${placeholderUrl})`,
              opacity: isLoaded ? 0 : 1,
            }}
            aria-hidden="true"
          />
        )}
        
        {/* Main image */}
        {(isInView || priority) && !hasError && (
          <NextImage
            src={src}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            priority={priority}
            quality={quality}
            sizes={responsiveSizes}
            loading={loading}
            className={cn(
              'transition-opacity duration-500',
              isLoaded ? 'opacity-100' : 'opacity-0',
              fill ? 'object-cover' : 'w-full h-auto',
              objectFit && `object-${objectFit}`
            )}
            style={objectPosition ? { objectPosition } : undefined}
            onLoad={handleImageLoad}
            onError={handleImageError}
            unoptimized={isExternal} // Don't optimize external images
          />
        )}
        
        {/* Fallback for error */}
        {hasError && (
          <div className="relative">
            <NextImage
              src={fallbackSrc}
              alt="Image could not be loaded"
              width={fill ? undefined : width}
              height={fill ? undefined : height}
              fill={fill}
              sizes={responsiveSizes}
              className="rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm p-2 text-center">
              Image could not be loaded
            </div>
          </div>
        )}
      </div>
      
      {/* Caption */}
      {caption && (
        <figcaption className="text-sm text-gray-500 mt-2 text-center">
          {caption}
        </figcaption>
      )}
      
      {/* Structured data for the image */}
      {addMetadata && imageMetadata && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ImageObject',
              contentUrl: imageMetadata.url,
              width: imageMetadata.width,
              height: imageMetadata.height,
              caption: caption || alt,
            }),
          }}
        />
      )}
    </figure>
  );
}

/**
 * Generate a simple blur data URL for images
 * @param width - The width of the blur image
 * @param height - The height of the blur image
 * @param color - The color of the blur image (hex)
 * @returns A data URL for a simple colored SVG
 */
export function generateBlurDataURL(
  width: number = 100,
  height: number = 100,
  color: string = '#e2e8f0'
): string {
  const svg = `
    <svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
    </svg>
  `;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Generate a shimmer effect blur data URL
 * @param width - The width of the shimmer
 * @param height - The height of the shimmer
 * @returns A data URL for a shimmer effect SVG
 */
export function generateShimmerDataURL(
  width: number = 700,
  height: number = 475
): string {
  const shimmer = `
    <svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#e2e8f0" offset="20%" />
          <stop stop-color="#f8fafc" offset="50%" />
          <stop stop-color="#e2e8f0" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="#e2e8f0" />
      <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="1s" repeatCount="indefinite"  />
    </svg>
  `;
  return `data:image/svg+xml;base64,${Buffer.from(shimmer).toString('base64')}`;
}

/**
 * Responsive image component that automatically sets sizes based on breakpoints
 */
export function ResponsiveImage(props: Omit<ImageProps, 'responsive' | 'sizes'>): React.JSX.Element {
  return (
    <Image
      {...props}
      responsive={true}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  );
}

/**
 * Full-width image component that spans the entire container
 */
export function FullWidthImage(props: Omit<ImageProps, 'responsive' | 'sizes' | 'className'>): React.JSX.Element {
  return (
    <Image
      {...props}
      responsive={true}
      sizes="100vw"
      className="w-full"
    />
  );
}

/**
 * Avatar image component for user profiles
 */
export function AvatarImage({
  src,
  alt,
  size = 40,
  ...props
}: Omit<ImageProps, 'width' | 'height' | 'className'> & { size?: number }): React.JSX.Element {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full"
      objectFit="cover"
      {...props}
    />
  );
}

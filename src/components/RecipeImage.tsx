import React, { useState, useEffect, useRef, memo } from 'react';
import { Recipe, RecipeIngredient } from '../types';
import { RecipeImageService, ERROR_IMAGE_FALLBACK } from '../services/RecipeImageService';

export interface RecipeImageProps {
  recipe?: Recipe;
  recipeId?: string;
  title?: string;
  cuisine?: string;
  imageQuery?: string;
  ingredients?: (string | RecipeIngredient)[];
  initialUrl?: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  aspectRatio?: string;
  onClick?: () => void;
  showSkeleton?: boolean;
}

/**
 * Universal High-Performance Recipe Image Component
 * 
 * Features:
 * - Direct 1-to-1 authoritative recipe-to-image matching
 * - Zero-blocking immediate render
 * - Lazy loading with IntersectionObserver (prioritizes visible items)
 * - Persistent caching (IndexedDB + in-memory Map)
 * - Concurrency queue (4-6 max parallel requests)
 * - Request deduplication across all components
 * - Retry with backoff on network errors
 * - Zero layout shift with responsive aspect ratios
 * - Clean fade-in on load
 */
export const RecipeImage: React.FC<RecipeImageProps> = memo(({
  recipe,
  recipeId: propRecipeId,
  title: propTitle,
  cuisine: propCuisine,
  imageQuery: propImageQuery,
  ingredients: propIngredients,
  initialUrl,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  priority = false,
  loading = 'lazy',
  aspectRatio,
  onClick,
  showSkeleton = true,
}) => {
  const id = propRecipeId || recipe?.id || '';
  const title = propTitle || recipe?.title || '';
  const cuisine = propCuisine || recipe?.cuisine;
  const imageQuery = propImageQuery || recipe?.imageQuery;
  const ingredients = propIngredients || recipe?.ingredients;
  const isHighPriority = Boolean(priority) || loading === 'eager';

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState<boolean>(isHighPriority);
  
  // Check if we already have a synchronous cached URL
  const syncInitial = id ? RecipeImageService.getCachedSync(id) : null;
  const [imgSrc, setImgSrc] = useState<string | null>(syncInitial || initialUrl || null);
  const [isLoaded, setIsLoaded] = useState<boolean>(Boolean(syncInitial || initialUrl));
  const [hasError, setHasError] = useState<boolean>(false);

  // 1. Intersection Observer for visible-first lazy loading
  useEffect(() => {
    if (isHighPriority || isInView) {
      setIsInView(true);
      return;
    }

    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && (entry.isIntersecting || entry.intersectionRatio > 0)) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px 0px', // Start loading 200px before entering viewport
        threshold: 0.01,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isHighPriority, isInView]);

  // 2. Load and resolve image when in view
  useEffect(() => {
    if (!isInView) return;

    let isMounted = true;
    const recipeObj = recipe || ({ id, title, cuisine, imageQuery, ingredients, imageUrl: initialUrl } as Recipe);

    // Fast path: check synchronous memory cache
    const cached = RecipeImageService.getCachedSync(id || title);
    if (cached) {
      setImgSrc(cached);
      setIsLoaded(true);
      setHasError(cached === ERROR_IMAGE_FALLBACK);
      return;
    }

    // Asynchronous path: Load from Persistent Cache or Concurrency Queue
    RecipeImageService.loadRecipeImage(
      recipeObj,
      isHighPriority ? 'high' : 'low'
    )
      .then((resolvedUrl) => {
        if (!isMounted) return;
        setImgSrc(resolvedUrl);
        setIsLoaded(true);
        setHasError(resolvedUrl === ERROR_IMAGE_FALLBACK);
      })
      .catch(() => {
        if (!isMounted) return;
        setImgSrc(ERROR_IMAGE_FALLBACK);
        setIsLoaded(true);
        setHasError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [isInView, id, title, cuisine, imageQuery, isHighPriority, initialUrl, recipe]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleImageError = () => {
    if (!hasError && id) {
      // Trigger retry through the service
      RecipeImageService.handleImageFailure(id).then((fallbackUrl) => {
        setImgSrc(fallbackUrl);
        setHasError(true);
        setIsLoaded(true);
      });
    } else {
      setImgSrc(ERROR_IMAGE_FALLBACK);
      setHasError(true);
      setIsLoaded(true);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      style={aspectRatio ? { aspectRatio } : undefined}
      className={`relative overflow-hidden ${containerClassName}`}
    >
      {/* Sleek Minimal Loading Skeleton */}
      {showSkeleton && !isLoaded && (
        <div className="absolute inset-0 bg-[#EFE8D8]/70 dark:bg-[#1A3325]/70 animate-pulse flex items-center justify-center pointer-events-none">
          <div className="w-6 h-6 rounded-full border-2 border-[#153B28]/10 dark:border-[#DCE9DA]/10 border-t-[#153B28]/40 dark:border-t-[#DCE9DA]/40 animate-spin" />
        </div>
      )}

      {/* Render Image once URL is resolved */}
      {imgSrc && (
        <img
          src={imgSrc}
          alt={alt || title || 'Recipe'}
          referrerPolicy="no-referrer"
          loading={isHighPriority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`${className} transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
});

RecipeImage.displayName = 'RecipeImage';

import { useState } from 'react';
import type { Photo } from '../lib/photos';
import { loadedUrls } from '../lib/imageCache';
import { classNames } from '../lib/utils';

interface GalleryImageProps {
  photo: Photo;
  /** Rendered width hints for the browser's srcset selection */
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Defer loading until near the viewport (ignored for priority images) */
  lazy?: boolean;
  /** Show a pulsing placeholder until the image has loaded */
  pulse?: boolean;
}

export function GalleryImage({ photo, sizes, className, priority, lazy = true, pulse }: GalleryImageProps) {
  const [loaded, setLoaded] = useState(() => loadedUrls.has(photo.url));

  return (
    <div
      className={classNames('overflow-hidden', className, pulse && !loaded && 'animate-pulse')}
      style={{ backgroundColor: '#ffd1dc' }}
    >
      <img
        src={photo.url}
        srcSet={photo.srcSet}
        sizes={sizes}
        alt={photo.alt}
        decoding="async"
        loading={priority || !lazy ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        className="w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: loaded ? 1 : 0 }}
        onLoad={() => { loadedUrls.add(photo.url); setLoaded(true); }}
      />
    </div>
  );
}

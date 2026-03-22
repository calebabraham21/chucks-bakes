import { useState } from 'react';
import { PHOTOS } from '../lib/photos';
import { loadedUrls } from '../lib/imageCache';

function GalleryImage({ url, alt, priority }: { url: string; alt: string; priority?: boolean }) {
  const [loaded, setLoaded] = useState(loadedUrls.has(url));

  return (
    <div
      className={`aspect-square rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:scale-[1.02] ${!loaded ? 'animate-pulse' : ''}`}
      style={{ backgroundColor: '#ffd1dc' }}
    >
      <img
        src={url}
        alt={alt}
        decoding="async"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'low'}
        className="w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: loaded ? 1 : 0 }}
        onLoad={() => { loadedUrls.add(url); setLoaded(true); }}
      />
    </div>
  );
}

export function Gallery() {
  return (
    <div className="bg-[#fde7ee] py-10">
      <div className="w-full max-w-5xl mx-auto px-4">

        <h1 className="font-bold text-black text-center mb-10">Gallery</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {PHOTOS.map((photo, index) => (
            <GalleryImage key={photo.url} {...photo} priority={index < 3} />
          ))}
        </div>

      </div>
    </div>
  );
}

import { useState } from 'react';

// Add new photos here — just drop the file in /public and add an entry
const PHOTOS = [
  { url: '/IMG_3212.jpeg', alt: 'Custom Cake' },
  { url: '/IMG_4029.jpeg', alt: 'Custom Cake' },
  { url: '/IMG_4422.jpeg', alt: 'Custom Cake' },
  { url: '/IMG_4611.jpeg', alt: 'Custom Cake' },
  { url: '/IMG_5076.jpeg', alt: 'Custom Cake' },
  { url: '/IMG_5439.jpeg', alt: 'Custom Cake' },
  { url: '/IMG_5929.jpeg', alt: 'Custom Cake' },
  { url: '/IMG_6109.jpeg', alt: 'Custom Cake' },
];

const loadedUrls = new Set<string>();

function GalleryImage({ url, alt }: { url: string; alt: string }) {
  const [loaded, setLoaded] = useState(loadedUrls.has(url));

  return (
    <div
      className="aspect-square rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:scale-[1.02]"
      style={{ backgroundColor: '#ffd1dc' }}
    >
      <img
        src={url}
        alt={alt}
        decoding="async"
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
          {PHOTOS.map((photo) => (
            <GalleryImage key={photo.url} {...photo} />
          ))}
        </div>

      </div>
    </div>
  );
}

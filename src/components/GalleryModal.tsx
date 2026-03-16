import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryModalProps {
  photos: { url: string; alt: string }[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export function GalleryModal({ photos, isOpen, onClose, initialIndex }: GalleryModalProps) {
  // null = grid view, number = lightbox index
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(
    initialIndex !== undefined ? initialIndex : null
  );

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const closeLightbox = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    setLightboxIndex(i => (i !== null ? (i - 1 + photos.length) % photos.length : null));
  }, [photos.length]);

  const next = useCallback(() => {
    setLightboxIndex(i => (i !== null ? (i + 1) % photos.length : null));
  }, [photos.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') lightboxIndex !== null ? closeLightbox() : onClose();
      if (e.key === 'ArrowLeft' && lightboxIndex !== null) prev();
      if (e.key === 'ArrowRight' && lightboxIndex !== null) next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, lightboxIndex, onClose, prev, next]);

  // Reset lightbox when modal closes
  useEffect(() => {
    if (!isOpen) setLightboxIndex(initialIndex !== undefined ? initialIndex : null);
  }, [isOpen, initialIndex]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-200 ease-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
    >
      {lightboxIndex !== null ? (
        /* ── Lightbox view ── */
        <div className="flex flex-col h-full">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
            <span className="text-white/70 text-sm font-medium">
              {lightboxIndex + 1} / {photos.length}
            </span>
            <button
              onClick={closeLightbox}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Back to grid"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Image */}
          <div className="flex-1 flex items-center justify-center px-4 pb-4 min-h-0 relative">
            <button
              onClick={prev}
              className="absolute left-2 sm:left-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            <img
              key={lightboxIndex}
              src={photos[lightboxIndex].url}
              alt={photos[lightboxIndex].alt}
              className="max-h-full max-w-full rounded-2xl object-contain"
              style={{ animation: 'fadeIn 0.2s ease-out' }}
            />

            <button
              onClick={next}
              className="absolute right-2 sm:right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-2 px-4 pb-4 overflow-x-auto flex-shrink-0 justify-center">
            {photos.map((photo, i) => (
              <button
                key={photo.url}
                onClick={() => setLightboxIndex(i)}
                className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-all ${
                  i === lightboxIndex ? 'ring-2 ring-[#ff6b9d] opacity-100' : 'opacity-50 hover:opacity-80'
                }`}
              >
                <img src={photo.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ── Grid view ── */
        <div
          className={`flex flex-col h-full transition-[transform,opacity] duration-200 ease-out ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0">
            <h2 className="text-white text-xl font-bold">All Cakes</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close gallery"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable grid */}
          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
              {photos.map((photo, i) => (
                <button
                  key={photo.url}
                  onClick={() => setLightboxIndex(i)}
                  className="aspect-square rounded-2xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#ff6b9d]"
                  style={{ backgroundColor: '#ffd1dc' }}
                >
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

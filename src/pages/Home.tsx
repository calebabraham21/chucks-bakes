import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PHOTOS } from '../lib/photos';

const loadedUrls = new Set<string>();

export function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [loadedSet, setLoadedSet] = useState<Set<string>>(() => new Set(loadedUrls));

  const handleLoad = (url: string) => {
    loadedUrls.add(url);
    setLoadedSet(prev => new Set(prev).add(url));
  };

  // Duplicate for seamless infinite scroll
  const duplicated = [...PHOTOS, ...PHOTOS, ...PHOTOS];

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollPosition = container.scrollLeft;
    let animationId: number;
    let isPaused = false;

    const scroll = () => {
      if (!isPaused) {
        scrollPosition += 0.6;
        if (scrollPosition >= container.scrollWidth / 3) {
          scrollPosition = 0;
        }
        container.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    const pause = () => { isPaused = true; };
    const resume = () => { isPaused = false; };

    container.addEventListener('mouseenter', pause);
    container.addEventListener('mouseleave', resume);
    container.addEventListener('touchstart', pause, { passive: true });
    container.addEventListener('touchend', resume);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mouseenter', pause);
      container.removeEventListener('mouseleave', resume);
      container.removeEventListener('touchstart', pause);
      container.removeEventListener('touchend', resume);
    };
  }, []);

  return (
    <div className="bg-[#fde7ee] pt-12 pb-12">
      <div className="w-full max-w-5xl mx-auto px-4">

        {/* Logo */}
        <div className="flex justify-center mb-8 logo-entrance">
          <img
            src="/ChucksBakesLogo.png"
            alt="Chuck's Bakes"
            className="h-32 w-auto sm:h-40 md:h-48 lg:h-56"
          />
        </div>

        {/* About / Intro */}
        <div className="mb-6 text-center max-w-2xl mx-auto text-entrance-delay">
          <p className="text-gray-700 text-lg sm:text-xl leading-relaxed mb-4">
            Hi! I'm Cristina, the founder of Chuck's Bakes! Named after Charleston, SC or "Chuck Town",
            Chuck's started as a way to document my love of baking. Since then, I have turned Chuck's
            into my business so I can share my cakes with all of you!
          </p>
          <p className="text-gray-700 text-lg sm:text-xl leading-relaxed">
            Whether you are ordering a cake for a birthday (my fav), graduation, anniversary, holiday, or just because, I can't wait to be a part of your celebration!
          </p>
        </div>

        {/* Order Button */}
        <div className="flex justify-center mb-10 text-entrance-delay">
          <Link
            to="/order"
            className="bg-white border-2 border-black text-black hover:bg-[#d63f6f] hover:text-white font-bold py-3 px-8 rounded-lg shadow-soft transition-all duration-300 active:scale-95"
          >
            Order Now
          </Link>
        </div>

        {/* Carousel */}
        <div>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-2xl font-bold text-black">Recent Cakes</h2>
            <Link
              to="/gallery"
              className="flex items-center gap-1 text-sm font-semibold text-[#ff6b9d] hover:text-[#d63f6f] transition-colors group"
            >
              See all cakes
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="relative overflow-hidden">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#fde7ee] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#fde7ee] to-transparent z-10 pointer-events-none" />

            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-hidden py-2"
              style={{ scrollBehavior: 'auto' }}
            >
              {duplicated.map((photo, index) => (
                <div
                  key={`${photo.url}-${index}`}
                  className="flex-shrink-0 w-52 h-52 sm:w-60 sm:h-60 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: '#ffd1dc' }}
                >
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    decoding="async"
                    className="w-full h-full object-cover transition-opacity duration-500"
                    style={{ opacity: loadedSet.has(photo.url) ? 1 : 0 }}
                    onLoad={() => handleLoad(photo.url)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

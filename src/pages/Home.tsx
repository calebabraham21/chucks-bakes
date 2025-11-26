import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { sanityClient, urlFor, type SanityHomepage } from '../lib/sanity';

export function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [homepage, setHomepage] = useState<SanityHomepage | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch homepage data from Sanity
  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        const query = `*[_type == "homepage"][0]{
          _id,
          welcomeDescription,
          galleryPhotos[]{
            asset,
            alt,
            caption
          }
        }`;
        
        const data = await sanityClient.fetch<SanityHomepage>(query);
        console.log('Homepage data from Sanity:', data);
        console.log('Gallery photos:', data?.galleryPhotos);
        setHomepage(data);
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepage();
  }, []);

  // Get gallery photos from Sanity or use placeholders
  const photos = homepage?.galleryPhotos?.length 
    ? homepage.galleryPhotos.map((photo) => ({
        url: urlFor(photo.asset).width(800).height(800).url(),
        alt: photo.alt || 'Baked goods',
        caption: photo.caption,
      }))
    : [
        { url: '/placeholder1.jpg', alt: 'Placeholder 1' },
        { url: '/placeholder2.jpg', alt: 'Placeholder 2' },
        { url: '/placeholder3.jpg', alt: 'Placeholder 3' },
        { url: '/placeholder4.jpg', alt: 'Placeholder 4' },
      ];

  // Duplicate photos for seamless infinite scroll
  const duplicatedPhotos = [...photos, ...photos, ...photos];

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollPosition = 0;
    let animationId: number;

    const scroll = () => {
      scrollPosition += 0.5; // Adjust speed here
      
      // Reset scroll position for infinite loop
      if (scrollPosition >= container.scrollWidth / 3) {
        scrollPosition = 0;
      }
      
      container.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    // Pause on hover
    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(scroll);
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="bg-[#fde7ee] pt-12 pb-6">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/ChucksBakesLogo.png" 
            alt="Chuck's Bakes" 
            className="h-32 w-auto sm:h-40 md:h-48 lg:h-56"
          />
        </div>

        {/* Description */}
        <div className="text-center mb-4 max-w-2xl mx-auto">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-3"></div>
              <div className="h-6 bg-gray-300 rounded w-full mx-auto"></div>
            </div>
          ) : (
            <p className="text-lg sm:text-xl md:text-2xl text-black-700 leading-relaxed font-semibold">
              {homepage?.welcomeDescription || 
                "Welcome to Chuck's Bakes! We create custom cakes, cupcakes, and treats made with love. Browse our offerings below to get started."
              }
            </p>
          )}
        </div>

        {/* Mobile Order Button */}
        <div className="md:hidden flex justify-center mb-4">
          <Link
            to="/order"
            className="bg-white border-2 border-black text-black hover:bg-[#d63f6f] hover:text-white font-bold py-3 px-8 rounded-lg shadow-soft transition-all duration-300 active:scale-95"
          >
            Order
          </Link>
        </div>

        {/* Infinite Scrolling Photo Gallery */}
        <div className="relative overflow-hidden">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#fde7ee] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#fde7ee] to-transparent z-10 pointer-events-none"></div>
          
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-hidden py-4"
            style={{ scrollBehavior: 'auto' }}
          >
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div 
                  key={`skeleton-${index}`}
                  className="flex-shrink-0 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-2xl bg-gray-300 animate-pulse"
                />
              ))
            ) : (
              duplicatedPhotos.map((photo, index) => (
                <div 
                  key={`${photo.url}-${index}`}
                  className="flex-shrink-0 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <img 
                    src={photo.url} 
                    alt={photo.alt || `Baked goods ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to a gradient if image doesn't exist
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.style.background = 
                        `linear-gradient(135deg, #ff6b9d ${index * 10}%, #ffa3ca ${index * 15}%, #ffc1d4 ${index * 20}%)`;
                    }}
                  />
                </div>
              ))
            )}
          </div>
          
          
        </div>
      </div>
    </div>
  );
}



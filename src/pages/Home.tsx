import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Hardcoded homepage data
const WELCOME_DESCRIPTION = "Welcome to Chuck's Bakes! We create custom cakes, cookies, brownies, and treats made with love. Browse our offerings below to get started.";

// Hardcoded gallery photos using existing images in public folder
const GALLERY_PHOTOS = [
  { url: '/Cake1.PNG', alt: 'Custom Cake' },
  { url: '/Cookies.PNG', alt: 'Cookies' },
  { url: '/brownies.PNG', alt: 'Brownies' },
  { url: '/scones.PNG', alt: 'Scones' },
];

export function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Get gallery photos
  const photos = GALLERY_PHOTOS;

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
          <p className="text-lg sm:text-xl md:text-2xl text-black-700 leading-relaxed font-semibold">
            {WELCOME_DESCRIPTION}
          </p>
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
            {duplicatedPhotos.map((photo, index) => (
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
            ))}
          </div>
          
          
        </div>
      </div>
    </div>
  );
}



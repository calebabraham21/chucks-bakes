export function KitchenIntro() {
  return (
    <section className="py-8 sm:py-10 md:py-12 bg-[#fff5f7]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            {/* Image/Portrait - Top on mobile, left on desktop */}
            <div className="order-1 md:order-1">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#ffc1d4] to-[#ffddeb] border-4 border-white shadow-lg">
                {/* Placeholder for Cristina's photo */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <span className="text-6xl sm:text-7xl md:text-8xl">👩‍🍳</span>
                    <p className="mt-4 text-[#000000] font-semibold text-sm">
                      Photo coming soon
                    </p>
                  </div>
                </div>
                {/* When you have a photo, replace with:
                <img 
                  src="/cristina-kitchen.jpg"
                  alt="Cristina in her Arlington kitchen"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  width="500"
                  height="500"
                />
                */}
              </div>
            </div>
            
            {/* Text content */}
            <div className="order-2 md:order-2 space-y-3 sm:space-y-4">
              <h2 
                className="font-black text-[#000000]"
                style={{ fontSize: 'clamp(1.313rem, 4.5vw, 1.75rem)' }}
              >
                From Cristina's kitchen
              </h2>
              
              <div className="space-y-3">
                <p 
                  className="text-[#262626] leading-relaxed"
                  style={{ fontSize: 'clamp(0.813rem, 3.2vw, 0.938rem)' }}
                >
                  Hi, I'm Cristina. I bake every order from scratch in my Arlington kitchen. 
                  No shelves, no shortcuts — just fresh, small-batch bakes for your celebrations.
                </p>
                
                <div className="pt-1">
                  <a 
                    href="/about"
                    className="inline-flex items-center gap-2 text-[#ff6b9d] hover:text-[#ed5a8a] font-semibold transition-colors touch-target"
                    style={{ fontSize: 'clamp(0.75rem, 3vw, 0.813rem)' }}
                  >
                    Learn more about my kitchen
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}


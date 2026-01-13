// Hardcoded kitchen intro data
const KITCHEN_TITLE = "From Cristina's kitchen";
const KITCHEN_DESCRIPTION = "Hi, I'm Cristina. I bake every order from scratch in my Arlington kitchen. No shelves, no shortcuts — just fresh, small-batch bakes for your celebrations.";
const KITCHEN_LINK_TEXT = "Learn more about my kitchen";
const KITCHEN_IMAGE: string | undefined = undefined; // Add image path if needed

export function KitchenIntro() {
  const title = KITCHEN_TITLE;
  const description = KITCHEN_DESCRIPTION;
  const linkText = KITCHEN_LINK_TEXT;

  return (
    <section className="py-8 sm:py-10 md:py-12 bg-[#fff5f7]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            {/* Image/Portrait - Top on mobile, left on desktop */}
            <div className="order-1 md:order-1 flex justify-center md:justify-start">
              <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-[#ffc1d4] to-[#ffddeb] border-4 border-white shadow-lg">
                {KITCHEN_IMAGE ? (
                  <img 
                    src={KITCHEN_IMAGE}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center p-6">
                      <span className="text-5xl sm:text-6xl">👩‍🍳</span>
                      <p className="mt-3 text-[#000000] font-semibold text-xs">
                        Photo coming soon
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Text content */}
            <div className="order-2 md:order-2 space-y-3 sm:space-y-4">
              <h2 
                className="font-black text-[#000000]"
                style={{ fontSize: 'clamp(1.313rem, 4.5vw, 1.75rem)' }}
              >
                {title}
              </h2>
              
              <div className="space-y-3">
                <p 
                  className="text-[#262626] leading-relaxed"
                  style={{ fontSize: 'clamp(0.813rem, 3.2vw, 0.938rem)' }}
                >
                  {description}
                </p>
                
                <div className="pt-1">
                  <a 
                    href="/about"
                    className="inline-flex items-center gap-2 text-[#ff6b9d] hover:text-[#ed5a8a] font-semibold transition-colors touch-target"
                    style={{ fontSize: 'clamp(0.75rem, 3vw, 0.813rem)' }}
                  >
                    {linkText}
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


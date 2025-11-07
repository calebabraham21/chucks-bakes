import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function Home() {
  const categories = [
    'CUSTOM CAKES',
    'BROWNIES',
    'COOKIES',
    'SCONES',
  ];
  
  return (
    <div className="min-h-screen bg-[#fde7ee]">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-5 md:px-8 py-8 sm:py-12 md:py-20">
        {/* Large Hero Text - mobile-first */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 className="font-black text-[#3b1f1e] leading-tight">
            HANDCRAFTED<br />
            BAKED GOODS.
          </h1>
        </div>

        {/* Three Cards Row - mobile-first stack */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 md:mb-16 max-w-7xl mx-auto">
          {/* Card 1 - Custom Cakes */}
          <div className="bg-[#ffddeb] rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden min-h-[240px] sm:min-h-[280px] md:min-h-[320px] border-2 sm:border-4 border-white shadow-[0_0_0_2px_#ff8ba7,0_4px_16px_rgba(255,107,157,0.2)] sm:shadow-[0_0_0_3px_#ff8ba7,0_8px_24px_rgba(255,107,157,0.25)] hover:shadow-[0_0_0_3px_#ff6b9d,0_12px_32px_rgba(255,107,157,0.35)] transition-all duration-300 active:scale-[0.98]">
            <img 
              src="/Cake1.PNG" 
              alt="" 
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
              width="400"
              height="300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#ffddeb] via-[#ffddeb]/50 to-transparent"></div>
            <div className="flex flex-col justify-center h-full text-center relative z-10">
              <p className="text-[#3b1f1e] font-black text-xl sm:text-2xl md:text-3xl">
                CUSTOM CAKES
              </p>
            </div>
          </div>

          {/* Card 2 - Featured Item */}
          <div className="bg-[#f5d4e0] rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden min-h-[240px] sm:min-h-[280px] md:min-h-[320px] border-2 sm:border-4 border-white shadow-[0_0_0_2px_#ff8ba7,0_4px_16px_rgba(255,107,157,0.2)] sm:shadow-[0_0_0_3px_#ff8ba7,0_8px_24px_rgba(255,107,157,0.25)] hover:shadow-[0_0_0_3px_#ff6b9d,0_12px_32px_rgba(255,107,157,0.35)] transition-all duration-300 active:scale-[0.98]">
            <img 
              src="/brownies.PNG" 
              alt="" 
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
              width="400"
              height="300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#f5d4e0] via-[#f5d4e0]/50 to-transparent"></div>
            <div className="flex flex-col justify-center h-full text-center relative z-10">
              <p className="text-[#3b1f1e] font-black text-xl sm:text-2xl md:text-3xl leading-tight">
                FUDGY<br />BROWNIES &<br />COOKIES
              </p>
            </div>
          </div>

          {/* Card 3 - Seasonal */}
          <div className="bg-[#ffc1d4] rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden min-h-[240px] sm:min-h-[280px] md:min-h-[320px] border-2 sm:border-4 border-white shadow-[0_0_0_2px_#ff8ba7,0_4px_16px_rgba(255,107,157,0.2)] sm:shadow-[0_0_0_3px_#ff8ba7,0_8px_24px_rgba(255,107,157,0.25)] hover:shadow-[0_0_0_3px_#ff6b9d,0_12px_32px_rgba(255,107,157,0.35)] transition-all duration-300 active:scale-[0.98] sm:col-span-2 md:col-span-1">
            <img 
              src="/scones.PNG" 
              alt="" 
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
              width="400"
              height="300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#ffc1d4] via-[#ffc1d4]/50 to-transparent"></div>
            <div className="flex flex-col justify-center h-full text-center relative z-10">
              <p className="text-[#3b1f1e] font-black text-xl sm:text-2xl md:text-3xl mb-2">
                SCONES
              </p>
              <p className="text-[#4a2c2a] text-sm opacity-75">
                * through November
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section - mobile-first */}
        <div className="bg-[#fadadd] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 max-w-7xl mx-auto border-2 sm:border-4 border-white shadow-[0_0_0_2px_#ff8ba7,0_4px_16px_rgba(255,107,157,0.2)] sm:shadow-[0_0_0_3px_#ff8ba7,0_8px_24px_rgba(255,107,157,0.25)]">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <h2 className="font-black text-[#3b1f1e] mb-4 sm:mb-6 leading-tight">
                BAKED<br />TO ORDER,<br />WITH LOVE.
              </h2>
              <div className="flex items-center gap-4 mb-4 sm:mb-6">
                <div className="bg-[#ff8ba7] rounded-full p-3 sm:p-4 flex-shrink-0">
                  <span className="text-2xl sm:text-3xl">💗</span>
                </div>
                <div className="text-[#4a2c2a]">
                  <p className="font-semibold text-sm sm:text-base">Every order is made fresh</p>
                  <p className="text-xs sm:text-sm">using quality ingredients</p>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right space-y-4 sm:space-y-6">
              <div>
                <p className="text-[#3b1f1e] font-bold text-base sm:text-lg mb-3">What we offer:</p>
                <div className="flex flex-wrap justify-center md:justify-end gap-2 sm:gap-3">
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-3 sm:px-4 py-2 bg-transparent border-2 border-[#4a2c2a] text-[#4a2c2a] rounded-full text-xs font-bold hover:bg-[#4a2c2a] hover:text-white transition-smooth touch-target"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <Link to="/order" className="block">
                <Button 
                  variant="primary" 
                  size="lg" 
                  fullWidth
                  className="bg-[#ff6b9d] text-white hover:bg-[#ed5a8a] active:bg-[#d94f78] border-none text-base sm:text-lg font-bold"
                >
                  START YOUR ORDER
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}



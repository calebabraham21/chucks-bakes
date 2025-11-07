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
      <section className="container mx-auto px-4 py-12 md:py-20">
        {/* Large Hero Text */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#3b1f1e] mb-4">
            HANDCRAFTED<br />
            BAKED GOODS.
          </h1>
          {/* Decorative steam lines */}
      
        </div>

        {/* Three Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-7xl mx-auto">
          {/* Card 1 - Custom Cakes */}
          <div className="bg-[#ffddeb] rounded-3xl p-8 relative overflow-hidden min-h-[320px] border-4 border-white shadow-[0_0_0_3px_#ff8ba7,0_8px_24px_rgba(255,107,157,0.25)] hover:shadow-[0_0_0_3px_#ff6b9d,0_12px_32px_rgba(255,107,157,0.35)] transition-all duration-300">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: 'url(/Cake1.PNG)' }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#ffddeb] via-[#ffddeb]/50 to-transparent"></div>
            <div className="flex flex-col justify-center h-full text-center relative z-10">
              <p className="text-[#3b1f1e] font-black text-2xl md:text-3xl">
                CUSTOM CAKES
              </p>
            </div>
          </div>

          {/* Card 2 - Featured Item */}
          <div className="bg-[#f5d4e0] rounded-3xl p-8 relative overflow-hidden min-h-[320px] border-4 border-white shadow-[0_0_0_3px_#ff8ba7,0_8px_24px_rgba(255,107,157,0.25)] hover:shadow-[0_0_0_3px_#ff6b9d,0_12px_32px_rgba(255,107,157,0.35)] transition-all duration-300">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: 'url(/brownies.PNG)' }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#f5d4e0] via-[#f5d4e0]/50 to-transparent"></div>
            <div className="flex flex-col justify-center h-full text-center relative z-10">
              <p className="text-[#3b1f1e] font-black text-2xl md:text-3xl leading-tight">
                FUDGY<br />BROWNIES &<br />COOKIES
              </p>
            </div>
          </div>

          {/* Card 3 - Seasonal */}
          <div className="bg-[#ffc1d4] rounded-3xl p-8 relative overflow-hidden min-h-[320px] border-4 border-white shadow-[0_0_0_3px_#ff8ba7,0_8px_24px_rgba(255,107,157,0.25)] hover:shadow-[0_0_0_3px_#ff6b9d,0_12px_32px_rgba(255,107,157,0.35)] transition-all duration-300">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: 'url(/scones.PNG)' }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#ffc1d4] via-[#ffc1d4]/50 to-transparent"></div>
            <div className="flex flex-col justify-center h-full text-center relative z-10">
              <p className="text-[#3b1f1e] font-black text-2xl md:text-3xl mb-2">
                SCONES
              </p>
              <p className="text-[#4a2c2a] text-xs opacity-75">
                * through November
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-[#fadadd] rounded-3xl p-8 md:p-12 max-w-7xl mx-auto border-4 border-white shadow-[0_0_0_3px_#ff8ba7,0_8px_24px_rgba(255,107,157,0.25)] hover:shadow-[0_0_0_3px_#ff6b9d,0_12px_32px_rgba(255,107,157,0.35)] transition-all duration-300">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-[#3b1f1e] mb-6 leading-tight">
                BAKED<br />TO ORDER,<br />WITH LOVE.
              </h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#ff8ba7] rounded-full p-4">
                  <span className="text-3xl">💗</span>
                </div>
                <div className="text-[#4a2c2a]">
                  <p className="font-semibold text-base">Every order is made fresh</p>
                  <p className="text-sm">using quality ingredients</p>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="mb-6">
                <p className="text-[#3b1f1e] font-bold text-lg mb-2">What we offer:</p>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-end gap-3 mb-8">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-4 py-2 bg-transparent border-2 border-[#4a2c2a] text-[#4a2c2a] rounded-full text-xs font-bold hover:bg-[#4a2c2a] hover:text-white transition-smooth cursor-pointer"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              <Link to="/order">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="bg-[#ff6b9d] text-white hover:bg-[#ed5a8a] border-none text-lg font-bold px-8"
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


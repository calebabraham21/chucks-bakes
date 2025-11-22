import { Link } from 'react-router-dom';
import { useHomepage } from '../../lib/useHomepage';
import { urlFor } from '../../lib/sanity';

export function Hero() {
  const { homepage } = useHomepage();

  const title = homepage?.heroTitle || 'Made fresh in Arlington — small-batch cakes, brownies, and scones.';
  const subtitle = homepage?.heroSubtitle || 'Every order is baked by Cristina with locally sourced ingredients and a whole lot of love.';
  const buttonText = homepage?.heroButtonText || 'Start Your Order';

  return (
    <section className="relative py-8 sm:py-12 flex items-center justify-center overflow-hidden">
      {/* Background pattern or image */}
      {homepage?.heroImage ? (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ backgroundImage: `url(${urlFor(homepage.heroImage).width(1920).url()})` }}
          aria-hidden="true"
        />
      ) : (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#fde7ee] via-[#fff5f7] to-[#ffc1d4] opacity-90"
          aria-hidden="true"
        />
      )}
      
      {/* Decorative pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b1f1e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto text-center">
        <div className="space-y-4 sm:space-y-5">
          <h1 
            className="font-black text-[#000000] leading-tight"
            style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}
          >
            {title}
          </h1>
          
          <p 
            className="text-[#262626] leading-relaxed max-w-2xl mx-auto"
            style={{ fontSize: 'clamp(0.875rem, 3.2vw, 1rem)' }}
          >
            {subtitle}
          </p>
          
          <div className="pt-2">
            <Link to="/order">
              <button 
                className="inline-flex items-center justify-center font-bold rounded-2xl bg-[#ff6b9d] text-white hover:bg-[#ed5a8a] active:bg-[#d94f78] shadow-lg hover:shadow-xl transition-all px-6 sm:px-10 py-3.5 min-h-[48px] active:scale-[0.98]"
                style={{ fontSize: 'clamp(0.875rem, 3.5vw, 1rem)' }}
              >
                {buttonText}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


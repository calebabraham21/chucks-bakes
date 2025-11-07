import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function Hero() {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background pattern or image */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#fde7ee] via-[#fff5f7] to-[#ffc1d4] opacity-90"
        aria-hidden="true"
      />
      
      {/* Decorative pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b1f1e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-5 md:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          <h1 
            className="font-black text-[#3b1f1e] leading-tight"
            style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)' }}
          >
            Made fresh in Arlington — small-batch cakes, brownies, and scones.
          </h1>
          
          <p 
            className="text-[#4a2c2a] leading-relaxed max-w-2xl mx-auto"
            style={{ fontSize: 'clamp(1rem, 3.6vw, 1.125rem)' }}
          >
            Every order is baked by Cristina with locally sourced ingredients and a whole lot of love.
          </p>
          
          <div className="pt-4">
            <Link to="/order">
              <Button 
                variant="primary" 
                size="lg"
                className="bg-[#ff6b9d] text-white hover:bg-[#ed5a8a] active:bg-[#d94f78] border-none font-bold shadow-lg hover:shadow-xl transition-all px-8 sm:px-12"
                style={{ fontSize: 'clamp(1rem, 4vw, 1.125rem)' }}
              >
                Start Your Order
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


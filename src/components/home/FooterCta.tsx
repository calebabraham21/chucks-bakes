import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function FooterCta() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-[#ff6b9d] to-[#ed5a8a] safe-bottom">
      <div className="container mx-auto px-4 sm:px-5 md:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
          <h2 
            className="font-black text-white leading-tight"
            style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)' }}
          >
            Craving something special?
            <br />
            Let's bake it.
          </h2>
          
          <p 
            className="text-white/90 leading-relaxed max-w-2xl mx-auto"
            style={{ fontSize: 'clamp(1rem, 3.6vw, 1.125rem)' }}
          >
            Ready to create something delicious together? Start your custom order today.
          </p>
          
          <div className="pt-4">
            <Link to="/order">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-[#ff6b9d] hover:bg-[#fff5f7] active:bg-[#fde7ee] border-none font-bold shadow-xl hover:shadow-2xl transition-all px-8 sm:px-12"
                style={{ fontSize: 'clamp(1rem, 4vw, 1.125rem)' }}
              >
                Start Your Order
              </Button>
            </Link>
          </div>
          
          <div className="pt-6 border-t border-white/20">
            <p 
              className="text-white/80 text-sm"
              style={{ fontSize: 'clamp(0.813rem, 3.2vw, 0.875rem)' }}
            >
              Questions? Email us at{' '}
              <a 
                href="mailto:orders@chucksbakes.com" 
                className="underline hover:text-white transition-colors"
              >
                orders@chucksbakes.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


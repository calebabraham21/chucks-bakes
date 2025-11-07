import { Link } from 'react-router-dom';

interface Occasion {
  emoji: string;
  title: string;
  color: string;
}

const occasions: Occasion[] = [
  {
    emoji: '🎂',
    title: 'Birthdays',
    color: '#ffddeb'
  },
  {
    emoji: '💌',
    title: 'Thank-yous',
    color: '#f5d4e0'
  },
  {
    emoji: '☕',
    title: 'Just Because',
    color: '#ffc1d4'
  },
  {
    emoji: '🎁',
    title: 'Holidays',
    color: '#fadadd'
  }
];

export function Occasions() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#fde7ee]">
      <div className="container mx-auto px-4 sm:px-5 md:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 
            className="font-black text-[#3b1f1e] mb-3"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 2.25rem)' }}
          >
            Perfect For Any Occasion
          </h2>
          <p 
            className="text-[#4a2c2a] max-w-2xl mx-auto"
            style={{ fontSize: 'clamp(0.938rem, 3.6vw, 1.063rem)' }}
          >
            Whatever you're celebrating, we'll bake something special
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {occasions.map((occasion) => (
            <Link 
              key={occasion.title}
              to="/order"
              className="group"
            >
              <div 
                className="rounded-2xl p-6 sm:p-8 text-center border-2 border-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] touch-manipulation min-h-[140px] sm:min-h-[160px] flex flex-col items-center justify-center gap-3 sm:gap-4"
                style={{ backgroundColor: occasion.color }}
              >
                <span 
                  className="text-5xl sm:text-6xl transition-transform group-hover:scale-110"
                  role="img" 
                  aria-label={occasion.title}
                >
                  {occasion.emoji}
                </span>
                <h3 
                  className="font-black text-[#3b1f1e]"
                  style={{ fontSize: 'clamp(1.063rem, 4vw, 1.25rem)' }}
                >
                  {occasion.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


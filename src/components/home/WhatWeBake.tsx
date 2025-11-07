import { Link } from 'react-router-dom';

interface BakeItem {
  title: string;
  description: string;
  image: string;
  color: string;
}

const items: BakeItem[] = [
  {
    title: 'Cakes',
    description: 'Custom sizes, flavors, and designs.',
    image: '/Cake1.PNG',
    color: '#ffddeb'
  },
  {
    title: 'Brownies',
    description: 'Fudgy, rich, and shareable.',
    image: '/brownies.PNG',
    color: '#f5d4e0'
  },
  {
    title: 'Cookies',
    description: 'Chewy classics and seasonal specials.',
    image: '/brownies.PNG', // Placeholder - update if you have cookies image
    color: '#ffc1d4'
  },
  {
    title: 'Scones',
    description: 'Buttery, tender, coffee-ready.',
    image: '/scones.PNG',
    color: '#fadadd'
  }
];

export function WhatWeBake() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-5 md:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 
            className="font-black text-[#3b1f1e] mb-3"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 2.25rem)' }}
          >
            What We Bake
          </h2>
          <p 
            className="text-[#4a2c2a] max-w-2xl mx-auto"
            style={{ fontSize: 'clamp(0.938rem, 3.6vw, 1.063rem)' }}
          >
            Made fresh to order, just for you
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {items.map((item) => (
            <Link 
              key={item.title}
              to="/order"
              className="group"
            >
              <div 
                className="relative overflow-hidden rounded-2xl border-2 border-[#ffc1d4] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] touch-manipulation"
                style={{ backgroundColor: item.color }}
              >
                {/* Image */}
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={item.image}
                    alt={`Freshly baked ${item.title.toLowerCase()}`}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-300"
                    width="400"
                    height="400"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                
                {/* Content */}
                <div className="p-5 sm:p-6">
                  <h3 
                    className="font-black text-[#3b1f1e] mb-2"
                    style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}
                  >
                    {item.title}
                  </h3>
                  <p 
                    className="text-[#4a2c2a] leading-snug"
                    style={{ fontSize: 'clamp(0.875rem, 3.5vw, 0.938rem)' }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


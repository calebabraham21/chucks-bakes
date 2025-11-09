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
    title: 'Cupcakes',
    description: 'Customizable flavors and frostings.',
    image: '/cupcakes.PNG',
    color: '#ffe5f0'
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
    image: '/Cookies.PNG',
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
    <section className="py-8 sm:py-10 md:py-12 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 
            className="font-black text-[#000000] mb-2"
            style={{ fontSize: 'clamp(1.5rem, 4.5vw, 1.875rem)' }}
          >
            What We Bake
          </h2>
          
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
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
                <div className="p-3 sm:p-4">
                  <h3 
                    className="font-black text-[#000000] mb-1"
                    style={{ fontSize: 'clamp(1.125rem, 3.5vw, 1.313rem)' }}
                  >
                    {item.title}
                  </h3>
                  <p 
                    className="text-[#262626] leading-snug"
                    style={{ fontSize: 'clamp(0.75rem, 3vw, 0.813rem)' }}
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


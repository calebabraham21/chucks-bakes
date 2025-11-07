interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Tell us what you'd like",
    description: 'Use our simple order form to share your vision',
    icon: '📝'
  },
  {
    number: 2,
    title: 'We confirm details & Venmo payment',
    description: 'Quick confirmation and easy payment through Venmo',
    icon: '💬'
  },
  {
    number: 3,
    title: 'Freshly baked for pickup or delivery',
    description: 'Your treats, made fresh and ready when you need them',
    icon: '🎁'
  }
];

export function HowItWorks() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-5 md:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 
            className="font-black text-[#3b1f1e] mb-3"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 2.25rem)' }}
          >
            How It Works
          </h2>
          <p 
            className="text-[#4a2c2a] max-w-2xl mx-auto"
            style={{ fontSize: 'clamp(0.938rem, 3.6vw, 1.063rem)' }}
          >
            Three simple steps to your perfect baked goods
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((step) => (
              <div 
                key={step.number}
                className="relative"
              >
                <div className="bg-[#fff5f7] rounded-2xl p-6 sm:p-8 border-2 border-[#ffc1d4] h-full transition-all hover:shadow-md">
                  {/* Step number badge */}
                  <div className="absolute -top-3 -left-3 w-10 h-10 sm:w-12 sm:h-12 bg-[#ff6b9d] text-white rounded-full flex items-center justify-center font-black shadow-lg">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="text-5xl sm:text-6xl mb-4 sm:mb-6 text-center">
                    {step.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 
                    className="font-bold text-[#3b1f1e] mb-3 text-center"
                    style={{ fontSize: 'clamp(1.063rem, 4vw, 1.25rem)' }}
                  >
                    {step.title}
                  </h3>
                  
                  <p 
                    className="text-[#4a2c2a] text-center leading-snug"
                    style={{ fontSize: 'clamp(0.875rem, 3.5vw, 0.938rem)' }}
                  >
                    {step.description}
                  </p>
                </div>
                
                {/* Connector arrow - desktop only */}
                {step.number < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 text-[#ffc1d4]">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


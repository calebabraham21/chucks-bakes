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
    <section className="py-8 sm:py-10 md:py-12 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 
            className="font-black text-[#000000] mb-2"
            style={{ fontSize: 'clamp(1.5rem, 4.5vw, 1.875rem)' }}
          >
            How It Works
          </h2>
         
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {steps.map((step) => (
              <div 
                key={step.number}
                className="relative"
              >
                <div className="bg-[#fff5f7] rounded-2xl p-4 sm:p-5 border-2 border-[#ffc1d4] h-full transition-all hover:shadow-md">
                  {/* Step number badge */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 sm:w-10 sm:h-10 bg-[#ff6b9d] text-white rounded-full flex items-center justify-center font-black shadow-lg text-sm sm:text-base">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 text-center">
                    {step.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 
                    className="font-bold text-[#000000] mb-2 text-center"
                    style={{ fontSize: 'clamp(0.938rem, 3.5vw, 1.063rem)' }}
                  >
                    {step.title}
                  </h3>
                  
                  <p 
                    className="text-[#262626] text-center leading-snug"
                    style={{ fontSize: 'clamp(0.75rem, 3vw, 0.813rem)' }}
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
    </section>
  );
}


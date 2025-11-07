export function ComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fde7ee] via-[#fff5f7] to-[#ffc1d4] flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <img 
            src="/ChucksBakesLogo.png" 
            alt="Chuck's Bakes" 
            className="h-24 sm:h-32 w-auto mx-auto"
            width="200"
            height="96"
          />
        </div>
        
        <h1 
          className="font-black text-[#3b1f1e] mb-6"
          style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}
        >
          Something Special is Baking...
        </h1>
        
        <p 
          className="text-[#4a2c2a] leading-relaxed mb-8"
          style={{ fontSize: 'clamp(1.125rem, 4vw, 1.5rem)' }}
        >
          We're putting the finishing touches on our new website.
          <br />
          Check back soon for fresh, handcrafted baked goods!
        </p>
        
        <div className="space-y-4">
          <p className="text-[#3b1f1e] font-semibold">
            For orders, reach out directly:
          </p>
          <a 
            href="mailto:orders@chucksbakes.com"
            className="inline-block bg-[#ff6b9d] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#ed5a8a] transition-all shadow-lg hover:shadow-xl"
          >
            orders@chucksbakes.com
          </a>
        </div>
        
        <p className="mt-12 text-[#4a2c2a] text-sm">
          Made with 💗 in Arlington
        </p>
      </div>
    </div>
  );
}


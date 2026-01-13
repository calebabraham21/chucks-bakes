import { Link } from 'react-router-dom';
import { Home, ShoppingBag, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Success() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fde7ee] via-[#fff5f7] to-[#fde7ee] flex items-center justify-center relative overflow-hidden">
      {/* Animated background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating cupcakes/treats */}
        <div className="absolute top-10 left-10 text-4xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>🧁</div>
        <div className="absolute top-20 right-16 text-3xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}>🍰</div>
        <div className="absolute bottom-32 left-20 text-3xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }}>🍪</div>
        <div className="absolute bottom-20 right-10 text-4xl animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '2.8s' }}>🎂</div>
        <div className="absolute top-1/3 left-5 text-2xl animate-bounce" style={{ animationDelay: '0.7s', animationDuration: '3.2s' }}>✨</div>
        <div className="absolute top-1/4 right-8 text-2xl animate-bounce" style={{ animationDelay: '1.2s', animationDuration: '2.7s' }}>💕</div>
      </div>

      {/* Confetti burst effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                backgroundColor: ['#ff6b9d', '#ffc1d4', '#ffddeb', '#ffd700', '#ff69b4'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-lg mx-auto">
          {/* Success checkmark with animation */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ff6b9d] to-[#ff8fb3] flex items-center justify-center shadow-lg animate-pulse-slow">
                <svg 
                  className="w-14 h-14 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ animation: 'checkmark 0.8s ease-out forwards' }}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={3} 
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              {/* Sparkle decorations */}
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#ff6b9d] animate-spin-slow" />
              <Sparkles className="absolute -bottom-1 -left-3 w-5 h-5 text-[#ffc1d4] animate-spin-slow" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* Main content */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-black text-[#000000] mb-3">
              Yay! Order Sent! 🎉
            </h1>
            
            <p className="text-lg text-[#333] mb-6 leading-relaxed">
              Thank you for choosing <span className="font-bold text-[#ff6b9d]">Chuck's Bakes</span>! 
              We're so excited to create something delicious for you.
            </p>

            {/* What happens next card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6 border border-[#ffc1d4]/30">
              <h2 className="font-bold text-[#000000] mb-3 flex items-center justify-center gap-2">
                <span className="text-xl">📬</span> What happens next?
              </h2>
              <ul className="text-left space-y-3 text-[#333]">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ff6b9d] text-white text-xs font-bold flex items-center justify-center">1</span>
                  <span>We'll review your order details</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ff6b9d] text-white text-xs font-bold flex items-center justify-center">2</span>
                  <span>You'll receive a confirmation email shortly</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ff6b9d] text-white text-xs font-bold flex items-center justify-center">3</span>
                  <span>We'll reach out within 24 hours to finalize everything</span>
                </li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/" className="flex-1">
                <button className="w-full inline-flex items-center justify-center gap-2 font-bold rounded-xl bg-[#ff6b9d] text-white hover:bg-[#ed5a8a] active:bg-[#d94f78] shadow-md hover:shadow-lg transition-all px-6 py-3.5 active:scale-[0.98]">
                  <Home className="w-5 h-5" aria-hidden="true" />
                  Back to Home
                </button>
              </Link>
              
              <Link to="/order" className="flex-1">
                <button className="w-full inline-flex items-center justify-center gap-2 font-bold rounded-xl bg-white text-[#ff6b9d] border-2 border-[#ff6b9d] hover:bg-[#fff5f7] active:bg-[#fde7ee] shadow-md hover:shadow-lg transition-all px-6 py-3.5 active:scale-[0.98]">
                  <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                  Place Another Order
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 107, 157, 0.4);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 15px rgba(255, 107, 157, 0);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        @keyframes checkmark {
          0% {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}

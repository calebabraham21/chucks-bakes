import { useState } from 'react';
import { Mail, Instagram, Send } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNewsletterSubmit = () => {
    // Don't prevent default - let the form submit to Mailchimp
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-[#fff5f7] to-white border-t border-[#ffd1dc] mt-auto">
      <div className="container mx-auto px-4 py-10">
        
        {/* Newsletter Signup */}
        <div className="max-w-md mx-auto mb-10 text-center">
          <h3 className="font-bold text-lg text-black mb-2">Get Updates</h3>
          <p className="text-sm text-gray-600 mb-4">
            New recipes, updates, and stories from me!
          </p>
          
          {isSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-700 font-medium">🎉 You're on the list!</p>
              <p className="text-green-600 text-sm">Check your email to confirm.</p>
            </div>
          ) : (
            <form
              action="https://chucksbakes.us18.list-manage.com/subscribe/post?u=65429164bbd1f17a6b40ffc49&id=0a4bb6a0e4"
              method="post"
              target="_blank"
              onSubmit={handleNewsletterSubmit}
              className="flex gap-2"
            >
              {/* Honeypot field - anti-spam */}
              <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                <input
                  type="text"
                  name="b_65429164bbd1f17a6b40ffc49_0a4bb6a0e4"
                  tabIndex={-1}
                  defaultValue=""
                />
              </div>
              
              <input
                type="email"
                name="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 rounded-xl border-2 border-[#ffd1dc] bg-white text-black placeholder-gray-400 focus:border-[#ff6b9d] focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#ff6b9d] hover:bg-[#ff5286] text-white font-semibold rounded-xl transition-colors flex items-center gap-2 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Subscribe</span>
              </button>
            </form>
          )}
          
          <p className="text-xs text-gray-400 mt-2">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>

        {/* Divider */}
        <div className="w-24 h-px bg-[#ffd1dc] mx-auto mb-8"></div>

        {/* Contact Links */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
          {/* Email */}
          <a
            href="mailto:orders@chucksbakes.com"
            className="flex items-center gap-2 text-black hover:text-[#ff6b9d] transition-colors group"
          >
            <Mail className="w-5 h-5" />
            <span className="font-medium">orders@chucksbakes.com</span>
          </a>

          {/* Divider */}
          <div className="hidden md:block w-px h-6 bg-[#ffd1dc]"></div>

          {/* Instagram */}
          <a
            href="https://instagram.com/chucksbakes"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-black hover:text-[#ff6b9d] transition-colors group"
          >
            <Instagram className="w-5 h-5" />
            <span className="font-medium">@chucksbakes</span>
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 text-sm text-gray-500">
          © {new Date().getFullYear()} Chuck's Bakes. Made with 🩷 in Arlington, VA
        </div>
      </div>
    </footer>
  );
}


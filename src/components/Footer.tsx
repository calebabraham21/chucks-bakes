import { Mail, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
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
          <div className="hidden md:block w-px h-6 bg-gray-300"></div>

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
        <div className="text-center mt-6 text-sm text-black">
          © {new Date().getFullYear()} Chuck's Bakes. All rights reserved.
        </div>
      </div>
    </footer>
  );
}


import { Mail, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#fff5f7] to-white border-t border-[#ffd1dc] mt-auto">
      <div className="container mx-auto px-4 py-10">

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

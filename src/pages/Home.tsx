import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { PHOTOS } from '../lib/photos';
import { classNames } from '../lib/utils';
import { GalleryImage } from '../components/GalleryImage';
import logoSrc from '../assets/ChucksBakesLogo.png?w=448&format=webp';
import logoSrcSet from '../assets/ChucksBakesLogo.png?w=256;448&format=webp&as=srcset';

// Two copies of the list let the CSS marquee loop seamlessly
const marqueePhotos = [...PHOTOS, ...PHOTOS];

export function Home() {
  return (
    <div className="bg-[#fde7ee] pt-12 pb-12">
      <div className="w-full max-w-5xl mx-auto px-4">

        {/* Logo */}
        <div className="flex justify-center mb-8 logo-entrance">
          <img
            src={logoSrc}
            srcSet={logoSrcSet}
            sizes="(min-width: 1024px) 224px, (min-width: 768px) 192px, (min-width: 640px) 160px, 128px"
            alt="Chuck's Bakes"
            width={448}
            height={448}
            fetchPriority="high"
            className="h-32 w-auto sm:h-40 md:h-48 lg:h-56"
          />
        </div>

        {/* About / Intro */}
        <div className="mb-6 text-center max-w-2xl mx-auto text-entrance-delay">
          <p className="text-black text-lg sm:text-xl leading-relaxed mb-4">
            Hi! I'm Cristina, the founder of Chuck's Bakes! Named after Charleston, SC or "Chuck Town",
            Chuck's started as a way to document my love of baking. Since then, I have turned Chuck's
            into my business so I can share my cakes with all of you!
          </p>
          <p className="text-black text-lg sm:text-xl leading-relaxed">
            Whether you are ordering a cake for a birthday (my fav), graduation, anniversary, holiday, or just because, I can't wait to be a part of your celebration!
          </p>
        </div>

        {/* Order Button */}
        <div className="flex justify-center mb-10 text-entrance-delay">
          <Link
            to="/order"
            className="order-now-btn font-bold py-3 px-8 rounded-lg shadow-soft active:scale-95"
          >
            Order Now
          </Link>
        </div>

        {/* Carousel */}
        <div>
          <div className="max-w-[820px] mx-auto flex items-baseline justify-between mb-4">
            <h2 className="text-2xl font-bold text-black">Gallery</h2>
            <Link
              to="/gallery"
              className="flex items-center gap-1 text-sm font-semibold text-[#ff6b9d] hover:text-[#d63f6f] transition-colors group"
            >
              Full Gallery
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="marquee max-w-[820px] mx-auto relative overflow-hidden">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#fde7ee] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#fde7ee] to-transparent z-10 pointer-events-none" />

            <ul
              className="marquee-track flex gap-4 w-max py-2"
              style={{ '--count': PHOTOS.length } as CSSProperties}
            >
              {marqueePhotos.map((photo, index) => {
                const isClone = index >= PHOTOS.length;
                return (
                  <li
                    key={`${photo.url}-${index}`}
                    className={classNames('flex-shrink-0', isClone && 'marquee-clone')}
                    aria-hidden={isClone || undefined}
                  >
                    <GalleryImage
                      photo={photo}
                      sizes="(min-width: 768px) 256px, (min-width: 640px) 240px, 208px"
                      priority={index < 4}
                      // Off-screen marquee items are clipped by the track, so native lazy-loading would only start as they slide in
                      lazy={false}
                      className="w-52 h-52 sm:w-60 sm:h-60 md:w-64 md:h-64 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:scale-105"
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

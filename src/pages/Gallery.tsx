import { PHOTOS } from '../lib/photos';
import { GalleryImage } from '../components/GalleryImage';

export default function Gallery() {
  return (
    <div className="bg-[#fde7ee] py-10">
      <div className="w-full max-w-5xl mx-auto px-4">

        <h1 className="font-bold text-black text-center mb-10">Gallery</h1>

        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {PHOTOS.map((photo, index) => (
            <li key={photo.url}>
              <GalleryImage
                photo={photo}
                sizes="(min-width: 1024px) 320px, (min-width: 640px) 33vw, 50vw"
                priority={index < 3}
                pulse
                className="aspect-square rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:scale-[1.02]"
              />
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

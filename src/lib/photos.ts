// Add new photos here — drop the file in src/assets/gallery and add an entry.
// The build generates resized WebP versions automatically.
const GALLERY = [
  { file: 'cake_322.webp', alt: 'Custom Cake' },
  { file: 'IMG_6109.webp', alt: 'Custom Cake' },
  { file: 'IMG_5929.webp', alt: 'Custom Cake' },
  { file: 'suz_cake.webp', alt: 'Custom Cake' },
  { file: 'IMG_5076.jpg', alt: 'Custom Cake' },
  { file: 'IMG_4611.jpg', alt: 'Custom Cake' },
  { file: 'IMG_4422.jpg', alt: 'Custom Cake' },
  { file: 'IMG_4029.jpg', alt: 'Custom Cake' },
  { file: 'IMG_3212.jpg', alt: 'Custom Cake' },
];

const srcSets = import.meta.glob<string>('../assets/gallery/*', {
  eager: true,
  import: 'default',
  query: '?w=384;512;768;1024&format=webp&as=srcset',
});

const fallbacks = import.meta.glob<string>('../assets/gallery/*', {
  eager: true,
  import: 'default',
  query: '?w=768&format=webp',
});

export interface Photo {
  url: string;
  srcSet: string;
  alt: string;
}

export const PHOTOS: Photo[] = GALLERY.map(({ file, alt }) => {
  const key = `../assets/gallery/${file}`;
  if (!(key in fallbacks)) throw new Error(`Gallery photo not found: src/assets/gallery/${file}`);
  return { url: fallbacks[key], srcSet: srcSets[key], alt };
});

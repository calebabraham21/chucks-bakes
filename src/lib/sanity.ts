import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Create Sanity client
export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'gxunh0um',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: false, // Disable CDN in development for instant updates
  apiVersion: '2024-11-22', // Use today's date
  token: undefined, // Public access (no token needed for reading published content)
});

// Debug log (remove this later)
console.log('Sanity Config:', {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'gxunh0um',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
});

// Image URL builder helper
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// TypeScript types for your Sanity schema
export interface SanityPost {
  _id: string;
  _type: 'post';
  title: string;
  slug: {
    current: string;
  };
  publishedAt: string;
  image?: {
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
  body?: Array<{
    _type: 'block';
    children: Array<{
      text: string;
    }>;
  }>;
}

export interface SanityHomepage {
  _id: string;
  _type: 'homepage';
  heroTitle?: string;
  heroSubtitle?: string;
  heroButtonText?: string;
  heroImage?: {
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
  kitchenTitle?: string;
  kitchenDescription?: string;
  kitchenLinkText?: string;
  kitchenImage?: {
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
  whatWeBakeTitle?: string;
  whatWeBakeSubtitle?: string;
  howItWorksTitle?: string;
  howItWorksSteps?: Array<{
    title: string;
    description: string;
  }>;
  footerCtaTitle?: string;
  footerCtaDescription?: string;
  footerCtaButtonText?: string;
}

export interface SanityOrderPage {
  _id: string;
  _type: 'orderPage';
  chooseItemTitle?: string;
  chooseItemSubtitle?: string;
  cakeLabel?: string;
  cakeDescription?: string;
  cupcakesLabel?: string;
  cupcakesDescription?: string;
  browniesLabel?: string;
  browniesDescription?: string;
  cookiesLabel?: string;
  cookiesDescription?: string;
  seasonalLabel?: string;
  seasonalDescription?: string;
}


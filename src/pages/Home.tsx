import { Hero } from '../components/home/Hero';
import { WhatWeBake } from '../components/home/WhatWeBake';
import { KitchenIntro } from '../components/home/KitchenIntro';
import { HowItWorks } from '../components/home/HowItWorks';
import { FooterCta } from '../components/home/FooterCta';

export function Home() {
  return (
    <div className="min-h-screen bg-[#fde7ee]">
      <Hero />
      <WhatWeBake />
      <KitchenIntro />
      <HowItWorks />
      <FooterCta />
    </div>
  );
}



import { Card } from '../components/ui/Card';
import { ShoppingBag, Shirt, Coffee } from 'lucide-react';

export function Merch() {
  const placeholderItems = [
    {
      title: 'Branded Tote Bags',
      icon: ShoppingBag,
    },
    {
      title: 'Baker\'s Aprons',
      icon: Shirt,
    },
    {
      title: 'Coffee Mugs',
      icon: Coffee,
    },
  ];
  
  return (
    <div className="min-h-screen bg-[#fde7ee]">
      <div className="container mx-auto py-8 sm:py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#000000] mb-3">
            Merchandise
          </h1>
          <p className="text-base text-[#525252] max-w-2xl mx-auto mb-6">
            Show your love for Chuck's Bakes! Merchandise store coming soon.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {placeholderItems.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <Card key={index} padding="lg" className="text-center opacity-60">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 mb-4">
                  <Icon className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-black">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2 italic">
                  Coming Soon
                </p>
              </Card>
            );
          })}
        </div>
        
    
      </div>
    </div>
  );
}


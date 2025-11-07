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
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#3b1f1e] mb-4">
            Merchandise
          </h1>
          <p className="text-lg text-[#7d4f45] max-w-2xl mx-auto mb-8">
            Show your love for Chuck's Bakes! Merchandise store coming soon.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {placeholderItems.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <Card key={index} padding="lg" className="text-center opacity-60">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-bakery-brown-100 text-bakery-brown-400 mb-4">
                  <Icon className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-bakery-cocoa">
                  {item.title}
                </h3>
                <p className="text-sm text-bakery-brown-500 mt-2 italic">
                  Coming Soon
                </p>
              </Card>
            );
          })}
        </div>
        
        <Card padding="lg" className="text-center bg-bakery-pink-50/50">
          <h2 className="text-2xl font-semibold text-bakery-cocoa mb-3">
            Stay Tuned!
          </h2>
          <p className="text-bakery-brown-600 mb-4">
            We're working on bringing you exclusive Chuck's Bakes merchandise. 
            Follow us for updates on when our store launches!
          </p>
          <p className="text-sm text-bakery-brown-500">
            🎨 In the meantime, enjoy our delicious baked goods!
          </p>
        </Card>
      </div>
    </div>
  );
}


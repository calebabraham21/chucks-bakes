import { Card } from '../components/ui/Card';
import { Cake, Cookie, Cherry } from 'lucide-react';

export function Recipes() {
  const placeholderRecipes = [
    {
      title: 'Classic Vanilla Cake',
      icon: Cake,
      description: 'Light and fluffy vanilla cake with buttercream frosting',
    },
    {
      title: 'Fudgy Brownies',
      icon: Cookie,
      description: 'Rich, chocolatey brownies with a fudgy center',
    },
    {
      title: 'Chocolate Chip Cookies',
      icon: Cookie,
      description: 'Crispy edges with a soft, chewy center',
    },
    {
      title: 'Seasonal Scones',
      icon: Cherry,
      description: 'Apple pie almond scones (available through November)',
    },
  ];
  
  return (
    <div className="min-h-screen bg-[#fde7ee]">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#3b1f1e] mb-4">
            Recipes
          </h1>
          <p className="text-lg text-[#7d4f45] max-w-2xl mx-auto">
            Explore our collection of tried-and-true recipes. Full recipe details coming soon!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {placeholderRecipes.map((recipe, index) => {
            const Icon = recipe.icon;
            
            return (
              <Card key={index} padding="lg" hoverable>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-bakery-pink-100 text-bakery-pink-600">
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-bakery-cocoa mb-2">
                      {recipe.title}
                    </h3>
                    <p className="text-bakery-brown-600 mb-3">
                      {recipe.description}
                    </p>
                    <span className="text-sm text-bakery-brown-500 italic">
                      Recipe coming soon
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-12 text-center">
          <Card padding="lg" className="inline-block">
            <p className="text-bakery-brown-600">
              📖 Check back soon for detailed recipes and baking tips!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}


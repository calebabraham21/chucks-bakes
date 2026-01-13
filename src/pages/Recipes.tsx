import { Card } from '../components/ui/Card';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

// Hardcoded recipe/post interface
interface Recipe {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  image?: string;
  excerpt: string;
}

// Hardcoded recipes data
const RECIPES: Recipe[] = [
  // Add your recipes here
  // Example:
  // {
  //   id: '1',
  //   title: 'Classic Vanilla Cake',
  //   slug: 'classic-vanilla-cake',
  //   publishedAt: '2024-01-15',
  //   image: '/Cake1.PNG',
  //   excerpt: 'A delicious classic vanilla cake recipe that never fails to impress...',
  // },
];

export function Recipes() {
  const posts = RECIPES;

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#fde7ee]">
      <div className="container mx-auto py-8 sm:py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#000000] mb-3">
            Recipes & Stories
          </h1>
          <p className="text-base text-[#525252] max-w-2xl mx-auto">
            Explore our collection of recipes, baking tips, and stories from Cristina's kitchen.
          </p>
        </div>

        {posts.length === 0 ? (
          <Card padding="lg" className="text-center">
            <p className="text-black mb-4">
              No recipes published yet. Check back soon!
            </p>
            <p className="text-sm text-black">
              📖 We're working on adding delicious recipes and baking tips!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden group cursor-pointer p-0">
                {post.image && (
                  <div className="aspect-[16/10] bg-gradient-to-br from-[#e47d9d] to-[#ffddeb] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                {!post.image && (
                  <div className="aspect-[16/10] bg-gradient-to-br from-[#e47d9d] to-[#ffddeb] flex items-center justify-center">
                    <span className="text-6xl">🧁</span>
                  </div>
                )}
                
                <div className="p-6 transition-colors duration-300 group-hover:bg-[#e47d9d]">
                  <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-white mb-3 transition-colors duration-300">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt)}
                    </time>
                  </div>
                  
                  <h2 className="text-xl font-bold text-black group-hover:text-white mb-3 line-clamp-2 transition-colors duration-300">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 group-hover:text-white text-sm leading-relaxed line-clamp-3 mb-4 transition-colors duration-300">
                    {post.excerpt}
                  </p>
                  
                  <Link
                    to={`/recipes/${post.slug}`}
                    className="inline-flex items-center gap-2 text-[#ff6b9d] group-hover:text-white font-semibold text-sm transition-colors duration-300"
                  >
                    Read more
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/Card';

// Hardcoded recipe/post interface
interface Recipe {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  image?: string;
  content: string; // HTML or plain text content
}

// Hardcoded recipes data (should match Recipes.tsx)
const RECIPES: Recipe[] = [
  // Add your recipes here
  // Example:
  // {
  //   id: '1',
  //   title: 'Classic Vanilla Cake',
  //   slug: 'classic-vanilla-cake',
  //   publishedAt: '2024-01-15',
  //   image: '/Cake1.PNG',
  //   content: '<p>This is a delicious recipe...</p>',
  // },
];

export function RecipePost() {
  const { slug } = useParams<{ slug: string }>();
  const post = RECIPES.find(r => r.slug === slug);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-[#fde7ee]">
        <div className="container mx-auto py-12">
          <Card padding="lg" className="text-center max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-black mb-4">Recipe Not Found</h1>
            <p className="text-gray-600 mb-6">This recipe could not be found.</p>
            <Link
              to="/recipes"
              className="inline-flex items-center gap-2 text-[#ff6b9d] hover:text-[#ed5a8a] font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Recipes
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fde7ee]">
      <div className="container mx-auto py-6 sm:py-8">
        {/* Back button */}
        <Link
          to="/recipes"
          className="inline-flex items-center gap-2 text-[#ff6b9d] hover:text-[#ed5a8a] font-semibold transition-colors mb-4 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all recipes
        </Link>

        {/* Main content */}
        <article className="max-w-2xl mx-auto">
          {/* Featured Image */}
          {post.image && (
            <div className="aspect-[16/10] rounded-xl overflow-hidden mb-6 shadow-lg max-w-lg mx-auto">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title and meta */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-[#000000] mb-3">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-2 text-sm text-black">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            </div>
          </div>

          {/* Body content */}
          <Card padding="md" className="max-w-none">
            <div className="text-sm md:text-base prose prose-gray max-w-none">
              {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <p className="text-gray-500 italic text-sm">No recipe content available yet.</p>
              )}
            </div>
          </Card>

          {/* Back button at bottom */}
          <div className="mt-6 text-center">
            <Link
              to="/recipes"
              className="inline-flex items-center gap-2 text-[#ff6b9d] hover:text-[#ed5a8a] font-semibold transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all recipes
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}


import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { sanityClient, urlFor, type SanityPost } from '../lib/sanity';
import { Calendar } from 'lucide-react';

export function Recipes() {
  const [posts, setPosts] = useState<SanityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch posts from Sanity
    console.log('Fetching posts from Sanity...');
    sanityClient
      .fetch<SanityPost[]>(
        `*[_type == "post"] | order(publishedAt desc) {
          _id,
          title,
          slug,
          publishedAt,
          image,
          body
        }`
      )
      .then((data) => {
        console.log('Sanity posts fetched:', data);
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Detailed error fetching posts:', err);
        console.error('Error message:', err.message);
        console.error('Error details:', err.details);
        setError(`Failed to load recipes: ${err.message || 'Please try again later.'}`);
        setLoading(false);
      });
  }, []);

  // Extract text preview from body blocks
  const getExcerpt = (body?: SanityPost['body']) => {
    if (!body || body.length === 0) return 'No description available.';
    
    const firstBlock = body[0];
    const text = firstBlock.children
      .map((child) => child.text)
      .join(' ');
    
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  };

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

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b9d]"></div>
            <p className="mt-4 text-gray-600">Loading recipes...</p>
          </div>
        ) : error ? (
          <Card padding="lg" className="text-center">
            <p className="text-red-600">{error}</p>
          </Card>
        ) : posts.length === 0 ? (
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
              <Card key={post._id} className="overflow-hidden group cursor-pointer p-0">
                {post.image && (
                  <div className="aspect-[16/10] bg-gradient-to-br from-[#e47d9d] to-[#ffddeb] overflow-hidden">
                    <img
                      src={urlFor(post.image).width(600).height(400).url()}
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
                    {getExcerpt(post.body)}
                  </p>
                  
                  <a
                    href={`/recipes/${post.slug.current}`}
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
                  </a>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sanityClient, urlFor, type SanityPost } from '../lib/sanity';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { PortableText } from '@portabletext/react';

export function RecipePost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<SanityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    sanityClient
      .fetch<SanityPost>(
        `*[_type == "post" && slug.current == $slug][0] {
          _id,
          title,
          slug,
          publishedAt,
          image,
          body
        }`,
        { slug }
      )
      .then((data) => {
        if (!data) {
          setError('Recipe not found');
        } else {
          setPost(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching post:', err);
        setError('Failed to load recipe');
        setLoading(false);
      });
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Custom components for Portable Text rendering
  const portableTextComponents = {
    block: {
      // Paragraphs
      normal: ({ children }: any) => (
        <p className="text-black leading-relaxed mb-4 first:mt-0">{children}</p>
      ),
      // Headings
      h1: ({ children }: any) => (
        <h1 className="text-3xl font-bold text-black mt-6 mb-4 first:mt-0">{children}</h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-2xl font-bold text-black mt-6 mb-3 first:mt-0">{children}</h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-xl font-semibold text-black mt-5 mb-3 first:mt-0">{children}</h3>
      ),
      h4: ({ children }: any) => (
        <h4 className="text-lg font-semibold text-black mt-4 mb-2 first:mt-0">{children}</h4>
      ),
      // Blockquote
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-[#ff6b9d] pl-4 italic text-black my-4">
          {children}
        </blockquote>
      ),
    },
    list: {
      // Bullet list
      bullet: ({ children }: any) => (
        <ul className="list-disc list-inside space-y-2 mb-4 ml-4 text-black">
          {children}
        </ul>
      ),
      // Numbered list
      number: ({ children }: any) => (
        <ol className="list-decimal list-inside space-y-2 mb-4 ml-4 text-black">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
      number: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
    },
    marks: {
      // Bold
      strong: ({ children }: any) => (
        <strong className="font-bold text-black">{children}</strong>
      ),
      // Italic
      em: ({ children }: any) => <em className="italic">{children}</em>,
      // Code
      code: ({ children }: any) => (
        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-[#ff6b9d]">
          {children}
        </code>
      ),
      // Links
      link: ({ children, value }: any) => (
        <a
          href={value?.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#ff6b9d] hover:text-[#ed5a8a] underline transition-colors"
        >
          {children}
        </a>
      ),
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fde7ee] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b9d]"></div>
          <p className="mt-4 text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#fde7ee]">
        <div className="container mx-auto py-12">
          <Card padding="lg" className="text-center max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-black mb-4">Recipe Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'This recipe could not be found.'}</p>
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
                src={urlFor(post.image).width(600).height(400).url()}
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
              {post.body && post.body.length > 0 ? (
                <PortableText value={post.body} components={portableTextComponents} />
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


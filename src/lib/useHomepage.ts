import { useState, useEffect } from 'react';
import { sanityClient, type SanityHomepage } from './sanity';

export function useHomepage() {
  const [homepage, setHomepage] = useState<SanityHomepage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient
      .fetch<SanityHomepage>(`*[_type == "homepage"][0]`)
      .then((data) => {
        setHomepage(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching homepage:', err);
        setLoading(false);
      });
  }, []);

  return { homepage, loading };
}


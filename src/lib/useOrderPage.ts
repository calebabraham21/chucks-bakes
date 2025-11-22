import { useState, useEffect } from 'react';
import { sanityClient, type SanityOrderPage } from './sanity';

export function useOrderPage() {
  const [orderPage, setOrderPage] = useState<SanityOrderPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient
      .fetch<SanityOrderPage>(`*[_type == "orderPage"][0]`)
      .then((data) => {
        setOrderPage(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching order page:', err);
        setLoading(false);
      });
  }, []);

  return { orderPage, loading };
}


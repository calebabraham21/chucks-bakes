import { useState, useEffect } from 'react';
import { sanityClient, type SanityOrderPage } from './sanity';

export function useOrderPage() {
  const [orderPage, setOrderPage] = useState<SanityOrderPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = `*[_type == "orderPage"][0]{
      _id,
      chooseItemTitle,
      chooseItemSubtitle,
      items[]{
        itemType,
        label,
        description,
        image{asset},
        enabled
      }
    }`;
    
    sanityClient
      .fetch<SanityOrderPage>(query)
      .then((data) => {
        console.log('Fetched order page data:', data);
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


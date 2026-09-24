import { useEffect, useState } from 'react';
import { getProducts, getProductQuantities } from '@/api/EcommerceApi';

let cache = null;

/**
 * Fetches all store products once (module-level cache) and merges live
 * inventory quantities into each variant.
 */
export function useProducts() {
  const [products, setProducts] = useState(cache || []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const response = await getProducts({ limit: '50' });
        const list = response.products;

        if (list.length > 0) {
          const quantities = await getProductQuantities({
            fields: 'inventory_quantity',
            product_ids: list.map((p) => p.id),
          });

          const quantityMap = new Map(quantities.variants.map((v) => [v.id, v.inventory_quantity]));

          list.forEach((product) => {
            product.variants = product.variants.map((variant) => ({
              ...variant,
              inventory_quantity: quantityMap.get(variant.id) ?? variant.inventory_quantity,
            }));
          });
        }

        cache = list;
        if (!cancelled) {
          setProducts(list);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load products');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading, error };
}

const LIMITED_PATTERN = /limited|goldstrike|crown|regal/i;

export const isLimitedEdition = (product) => LIMITED_PATTERN.test(product.title || '');

export const isPremium = (product) => (product.price_in_cents || 0) >= 299900;

const BEST_SELLER_TITLES = [
  'Apex Noir Runner',
  'Sultan White Leather Sneaker',
  'Titan Chunky Sneaker',
  'Crimson Court Low',
  'Vortex Street Runner',
  'Zenith Mesh Runner',
  'Blaze Red Knit Trainer',
  'Ivory Court Classic',
];

export function getTabProducts(products, tab) {
  if (!products?.length) {
    return [];
  }

  switch (tab) {
    case 'new':
      return [...products]
        .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)))
        .slice(0, 8);
    case 'best': {
      const picked = BEST_SELLER_TITLES.map((title) => products.find((p) => p.title === title)).filter(Boolean);
      return picked.length > 0 ? picked : products.slice(0, 8);
    }
    case 'premium':
      return products.filter(isPremium);
    case 'limited':
      return products.filter(isLimitedEdition);
    default:
      return products;
  }
}

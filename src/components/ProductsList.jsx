import React from 'react';
import { Loader2, SearchX } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Luxury product grid. Receives an already-filtered product list from the
 * parent (ShopPage / HomePage tabs) and renders ProductCards.
 */
const ProductsList = ({ products = [], loading = false, error = null }) => {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-destructive/40 bg-destructive/10 p-8 text-center text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-border py-20 text-center">
        <SearchX className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">{t('noResults')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductsList;

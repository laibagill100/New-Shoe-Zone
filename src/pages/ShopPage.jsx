import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductsList from '@/components/ProductsList';
import { useProducts, getTabProducts } from '@/hooks/useProducts';
import { useLanguage } from '@/contexts/LanguageContext';

const ShopPage = () => {
  const { t } = useLanguage();
  const { products, loading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const query = (searchParams.get('q') || '').trim().toLowerCase();
  const tab = searchParams.get('tab') || 'all';
  const sort = searchParams.get('sort') || 'featured';

  const categories = [
    { value: 'all', label: t('allCategories') },
    { value: 'new', label: t('newArrivals') },
    { value: 'best', label: t('bestSellers') },
    { value: 'premium', label: t('premiumSelection') },
    { value: 'limited', label: t('limitedEdition') },
  ];

  const filtered = useMemo(() => {
    let list = tab === 'all' ? [...products] : getTabProducts(products, tab);

    if (query) {
      list = list.filter((p) => {
        const text = `${p.title} ${p.subtitle || ''} ${(p.description || '').replace(/<[^>]*>/g, '')}`.toLowerCase();
        return text.includes(query);
      });
    }

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price_in_cents - b.price_in_cents);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price_in_cents - a.price_in_cents);
        break;
      case 'name':
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return list;
  }, [products, tab, query, sort]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'all' && value !== 'featured') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next, { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>Shop Premium Men’s Shoes — New Shoe Zone Sukkur</title>
        <meta
          name="description"
          content="Browse the full New Shoe Zone collection — premium men's sneakers, loafers, boots and dress shoes from PKR 1,999–3,999. COD, JazzCash, Easypaisa, bank transfer and cards accepted."
        />
      </Helmet>

      {/* Page header */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.35em] text-primary">{t('menFootwear')}</p>
          <h1 className="font-display text-4xl uppercase leading-none sm:text-5xl">{t('shopTitle')}</h1>
          <p className="mt-4 max-w-lg text-sm text-muted-foreground">{t('shopSub')}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Filter bar */}
        <div className="mb-10 flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setParam('tab', value)}
                className={`border px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-all ${
                  tab === value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {query && (
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {filtered.length} {t('resultsFor')} “{query}”
              </span>
            )}
            <Select value={sort} onValueChange={(v) => setParam('sort', v)}>
              <SelectTrigger className="w-48 rounded-sm border-border text-xs font-bold uppercase tracking-[0.15em]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-sm">
                <SelectItem value="featured">{t('sortFeatured')}</SelectItem>
                <SelectItem value="price-asc">{t('sortPriceLow')}</SelectItem>
                <SelectItem value="price-desc">{t('sortPriceHigh')}</SelectItem>
                <SelectItem value="name">{t('sortName')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ProductsList products={filtered} loading={loading} error={error} />
      </section>
    </>
  );
};

export default ShopPage;

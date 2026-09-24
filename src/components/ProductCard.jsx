import React, { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, ShoppingBag, Zap, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { initializeCheckout } from '@/api/EcommerceApi';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { isLimitedEdition } from '@/hooks/useProducts';
import QuickViewDialog from '@/components/QuickViewDialog';

export const placeholderImage =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTExIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzg4OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5FVyBTSE9FIFpPTkU8L3RleHQ+Cjwvc3ZnPgo=";

const BATA_SIZES = ['40/6', '41/7', '42/8', '43/9', '44/10', '45/11'];

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  const variant = useMemo(() => product.variants?.[0], [product]);
  const hasSale = variant?.sale_price_in_cents != null;
  const displayPrice = hasSale ? variant.sale_price_formatted : variant?.price_formatted;
  const originalPrice = hasSale ? variant.price_formatted : null;
  const limited = isLimitedEdition(product);

  const handleAddToCart = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!product.variants?.length) {
        return;
      }

      if (!selectedSize) {
        alert('Please select size');
        return;
      }

      try {
        await addToCart(product, variant, 1, variant.inventory_quantity, selectedSize);
        toast({
          title: t('addedToCart'),
          description: `${product.title} — Size: PK/EU ${selectedSize}`,
        });
      } catch (cartError) {
        toast({ title: t('addedToCart'), description: cartError.message, variant: 'destructive' });
      }
    },
    [product, variant, selectedSize, addToCart, toast, t],
  );

  const openQuickView = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  }, []);

  const handleBuyItNow = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!product.variants?.length) {
        return;
      }

      if (!selectedSize) {
        alert('Please select size');
        return;
      }

      // Multiple variants (e.g. sizes/colors) — let the customer pick in quick view.
      if (product.variants.length > 1) {
        setQuickViewOpen(true);
        return;
      }

      setBuyingNow(true);
      try {
        const successUrl = `${window.location.origin}/success?checkout=success`;
        const cancelUrl = `${window.location.href}`;
        const { url } = await initializeCheckout({
          items: [{ variant_id: variant.id, quantity: 1 }],
          successUrl,
          cancelUrl,
        });
        window.location.href = url;
      } catch (error) {
        setBuyingNow(false);
        toast({ title: t('buyItNow'), description: error.message || 'Checkout failed. Please try again.', variant: 'destructive' });
      }
    },
    [product, variant, selectedSize, toast, t],
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, delay: (index % 4) * 0.06, ease: 'easeOut' }}
        className="group relative"
      >
        <Link to={`/product/${product.id}`} className="block">
          <div className="relative overflow-hidden rounded-sm border border-border bg-secondary">
            <img
              src={product.image || placeholderImage}
              alt={product.title}
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {limited && (
              <span className="absolute left-3 top-3 bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                {t('limitedBadge')}
              </span>
            )}
            {hasSale && (
              <span className="absolute right-3 top-3 bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground">
                {t('saleBadge')}
              </span>
            )}

            {/* Quick view */}
            <button
              onClick={openQuickView}
              className="absolute inset-x-4 bottom-4 flex translate-y-3 items-center justify-center gap-2 bg-background/95 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-foreground opacity-0 backdrop-blur transition-all duration-300 hover:bg-primary hover:text-primary-foreground focus:translate-y-0 focus:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
              aria-label={`${t('quickView')} — ${product.title}`}
            >
              <Eye className="h-4 w-4" />
              {t('quickView')}
            </button>
          </div>

          <div className="flex items-start justify-between gap-3 pt-4">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold uppercase tracking-wide text-foreground">{product.title}</h3>
              <p className="mt-0.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">{t('menFootwear')}</p>
            </div>
            <div className="shrink-0 text-right">
              {originalPrice && (
                <span className="block text-xs text-muted-foreground line-through">{originalPrice}</span>
              )}
              <span className="block text-sm font-extrabold text-gold">{displayPrice}</span>
            </div>
          </div>
        </Link>

        <div className="size-scale">
          {BATA_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              data-size={s}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedSize(s);
              }}
              aria-pressed={selectedSize === s}
              className={`size-box${selectedSize === s ? ' active' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={handleAddToCart}
          className="mt-3 flex w-full items-center justify-center gap-2 border border-border py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-foreground transition-all duration-200 hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-[0.98]"
        >
          <ShoppingBag className="h-4 w-4" />
          {t('addToCart')}
        </button>

        <button
          onClick={handleBuyItNow}
          disabled={buyingNow}
          style={{ background: '#E30613', color: 'white', width: '100%', marginTop: '8px' }}
          className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-70"
        >
          {buyingNow ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
          {t('buyItNow')}
        </button>
      </motion.div>

      <QuickViewDialog product={product} open={quickViewOpen} onOpenChange={setQuickViewOpen} />
    </>
  );
};

export default ProductCard;

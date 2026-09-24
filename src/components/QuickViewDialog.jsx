import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { placeholderImage } from '@/components/ProductCard';

const BATA_SIZES = ['40/6', '41/7', '42/8', '43/9', '44/10', '45/11'];

const QuickViewDialog = ({ product, open, onOpenChange }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    setSelectedSize(null);
  }, [product?.id]);

  const variant = selectedVariant || product?.variants?.[0];
  const hasSale = variant?.sale_price_in_cents != null;
  const displayPrice = hasSale ? variant.sale_price_formatted : variant?.price_formatted;
  const originalPrice = hasSale ? variant.price_formatted : null;

  const plainDescription = useMemo(() => {
    if (!product?.description) {
      return '';
    }
    const div = document.createElement('div');
    div.innerHTML = product.description;
    return div.textContent || '';
  }, [product?.description]);

  const handleAdd = useCallback(async () => {
    if (!product || !variant) {
      return;
    }
    if (!selectedSize) {
      alert('Please select size');
      return;
    }
    try {
      await addToCart(product, variant, 1, variant.inventory_quantity, selectedSize);
      toast({ title: t('addedToCart'), description: `${product.title} — Size: PK/EU ${selectedSize}` });
      onOpenChange(false);
    } catch (error) {
      toast({ title: t('addedToCart'), description: error.message, variant: 'destructive' });
    }
  }, [product, variant, selectedSize, addToCart, toast, t, onOpenChange]);

  const handleViewFull = useCallback(() => {
    onOpenChange(false);
    navigate(`/product/${product.id}`);
  }, [navigate, product, onOpenChange]);

  if (!product) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden rounded-sm border-border bg-card p-0">
        <DialogTitle className="sr-only">{product.title}</DialogTitle>
        <div className="grid sm:grid-cols-2">
          <div className="relative bg-secondary">
            <img
              src={product.image || placeholderImage}
              alt={product.title}
              className="h-64 w-full object-cover sm:h-full"
            />
            {product.ribbon_text && (
              <span className="absolute left-3 top-3 bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground">
                {product.ribbon_text}
              </span>
            )}
          </div>

          <div className="flex flex-col p-6 sm:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">{t('menFootwear')}</p>
            <h3 className="mt-2 font-display text-2xl uppercase leading-tight text-card-foreground">{product.title}</h3>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-gold">{displayPrice}</span>
              {originalPrice && <span className="text-sm text-muted-foreground line-through">{originalPrice}</span>}
            </div>

            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{plainDescription}</p>

            {product.variants?.length > 1 && (
              <div className="mt-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-card-foreground">{t('selectSize')}</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        variant?.id === v.id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border text-foreground hover:border-primary'
                      }`}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-card-foreground">
                {t('sizeLabel')}: <span className="text-gold">{selectedSize || '—'}</span>
              </p>
              <div className="size-scale">
                {BATA_SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    data-size={s}
                    onClick={() => setSelectedSize(s)}
                    aria-pressed={selectedSize === s}
                    className={`size-box${selectedSize === s ? ' active' : ''}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-2 pt-6">
              <Button
                onClick={handleAdd}
                disabled={!product.purchasable}
                className="w-full rounded-sm bg-primary py-5 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                {t('addToCart')}
              </Button>
              <button
                onClick={handleViewFull}
                className="flex items-center justify-center gap-1.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-gold"
              >
                {t('viewAll')} <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewDialog;

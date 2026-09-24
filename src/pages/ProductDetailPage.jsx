import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProduct, getProductQuantities } from '@/api/EcommerceApi';
import { Button } from '@/components/ui/button';
import BookingSlotPicker from '@/components/BookingSlotPicker';
import ProductsList from '@/components/ProductsList';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { placeholderImage } from '@/components/ProductCard';
import {
  ShoppingBag,
  Loader2,
  ArrowLeft,
  CheckCircle,
  Minus,
  Plus,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
} from 'lucide-react';

const BATA_SIZES = ['40/6', '41/7', '42/8', '43/9', '44/10', '45/11'];

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { products: allProducts } = useProducts();

  const related = useMemo(
    () => allProducts.filter((p) => p.id !== id).slice(0, 4),
    [allProducts, id],
  );

  const handleAddToCart = useCallback(async () => {
    if (!product || !selectedVariant) return;
    if (!selectedSize) {
      alert('Please select size');
      return;
    }
    try {
      await addToCart(product, selectedVariant, quantity, selectedVariant.inventory_quantity, selectedSize);
      toast({
        title: t('addedToCart'),
        description: `${quantity} × ${product.title} — Size: PK/EU ${selectedSize}`,
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: t('addedToCart'),
        description: err.message,
      });
    }
  }, [product, selectedVariant, quantity, selectedSize, addToCart, toast, t]);

  const handleBuyItNow = useCallback(async () => {
    if (!product || !selectedVariant) return;
    if (!selectedSize) {
      alert('Please select size');
      return;
    }
    try {
      await addToCart(product, selectedVariant, quantity, selectedVariant.inventory_quantity, selectedSize);
      navigate('/checkout');
    } catch (err) {
      toast({
        variant: 'destructive',
        title: t('addedToCart'),
        description: err.message,
      });
    }
  }, [product, selectedVariant, quantity, selectedSize, addToCart, navigate, toast, t]);

  const handleQuantityChange = useCallback((amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  }, []);

  const handlePrevImage = useCallback(() => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  }, [product?.images?.length]);

  const handleNextImage = useCallback(() => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }
  }, [product?.images?.length]);

  const handleVariantSelect = useCallback(
    (variant) => {
      setSelectedVariant(variant);
      if (variant.image_url && product?.images?.length > 0) {
        const imageIndex = product.images.findIndex((image) => image.url === variant.image_url);
        if (imageIndex !== -1) {
          setCurrentImageIndex(imageIndex);
        }
      }
    },
    [product?.images],
  );

  // Derive available colors and sizes from product options, with sensible
  // fallbacks so every product page shows a working selector.
  const COLOR_NAMES = [
    'Black', 'White', 'Grey', 'Brown', 'Maroon', 'Tan', 'Navy',
    'Blue', 'Red', 'Green', 'Beige', 'Cream', 'Charcoal',
  ];

  const { availableColors } = useMemo(() => {
    const colors = new Set();

    (product?.options || []).forEach((opt) => {
      const titleLower = (opt.title || '').toLowerCase();
      const isColorOption = COLOR_NAMES.some((c) => titleLower.includes(c.toLowerCase()));

      (opt.values || []).forEach((val) => {
        const v = (val.value || '').trim();
        if (!v) return;
        const vLower = v.toLowerCase();
        if (COLOR_NAMES.some((c) => vLower === c.toLowerCase())) {
          colors.add(v.charAt(0).toUpperCase() + v.slice(1));
        }
      });

      if (isColorOption) {
        (opt.title || '').split(/[,/\s]+/).forEach((tok) => {
          const t = tok.trim();
          if (COLOR_NAMES.some((c) => t.toLowerCase() === c.toLowerCase())) {
            colors.add(t.charAt(0).toUpperCase() + t.slice(1));
          }
        });
      }
    });

    // Fallbacks: derive a color from the product title, else default palette.
    if (colors.size === 0) {
      const fromTitle = COLOR_NAMES.find((c) =>
        (product?.title || '').toLowerCase().includes(c.toLowerCase()),
      );
      if (fromTitle) {
        colors.add(fromTitle);
        colors.add('Black');
        colors.add('White');
      } else {
        ['White', 'Black', 'Grey'].forEach((c) => colors.add(c));
      }
    }

    return { availableColors: [...colors] };
  }, [product]);

  // Initialise the color/size selection once the product loads.
  useEffect(() => {
    if (availableColors.length && !selectedColor) setSelectedColor(availableColors[0]);
  }, [availableColors, selectedColor]);

  // When color/size change, try to match a real variant; otherwise keep the
  // current variant so the cart flow keeps working.
  const handleColorSelect = useCallback(
    (color) => {
      setSelectedColor(color);
      if (product?.variants?.length > 1) {
        const match = product.variants.find((v) =>
          (v.options || []).some((o) => o.value === color),
        );
        if (match) handleVariantSelect(match);
      }
    },
    [product, handleVariantSelect],
  );

  const handleSizeSelect = useCallback(
    (size) => {
      setSelectedSize(size);
    },
    [],
  );

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        setSelectedSize(null);
        const fetchedProduct = await getProduct(id);

        const quantitiesResponse = await getProductQuantities({
          fields: 'inventory_quantity',
          product_ids: [fetchedProduct.id],
        });

        const variantQuantityMap = new Map();
        quantitiesResponse.variants.forEach((variant) => {
          variantQuantityMap.set(variant.id, variant.inventory_quantity);
        });

        const productWithQuantities = {
          ...fetchedProduct,
          variants: fetchedProduct.variants.map((variant) => ({
            ...variant,
            inventory_quantity: variantQuantityMap.get(variant.id) ?? variant.inventory_quantity,
          })),
        };

        setProduct(productWithQuantities);
        if (productWithQuantities.variants?.length > 0) {
          setSelectedVariant(productWithQuantities.variants[0]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <Link to="/shop" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft size={16} />
          {t('backToShop')}
        </Link>
        <div className="border border-destructive/40 bg-destructive/10 p-10 text-center text-destructive">
          <XCircle className="mx-auto mb-4 h-12 w-12" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const isBooking = product.type?.value === 'booking';
  const price = selectedVariant?.sale_price_formatted ?? selectedVariant?.price_formatted;
  const originalPrice = selectedVariant?.price_formatted;
  const availableStock = selectedVariant ? selectedVariant.inventory_quantity : 0;
  const isStockManaged = selectedVariant?.manage_inventory ?? false;
  const canAddToCart = !isStockManaged || quantity <= availableStock;

  const currentImage = product.images[currentImageIndex];
  const hasMultipleImages = product.images.length > 1;

  return (
    <>
      <Helmet>
        <title>{product.title} — New Shoe Zone | Premium Footwear Sukkur</title>
        <meta name="description" content={(product.description || '').replace(/<[^>]*>/g, '').substring(0, 160) || product.title} />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <Link to="/shop" className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft size={14} />
          {t('backToShop')}
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="relative overflow-hidden rounded-sm border border-border bg-secondary">
              <img
                src={currentImage?.url || product.image || placeholderImage}
                alt={product.title}
                className="aspect-square w-full object-cover"
              />

              {hasMultipleImages && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-black/60 text-white transition-colors hover:bg-primary"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-black/60 text-white transition-colors hover:bg-primary"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {product.ribbon_text && (
                <span className="absolute left-4 top-4 bg-gold px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-black">
                  {product.ribbon_text}
                </span>
              )}
            </div>

            {hasMultipleImages && (
              <div className="mt-3 flex gap-3 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-sm border-2 transition-colors ${
                      index === currentImageIndex ? 'border-primary' : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <img src={image.url || placeholderImage} alt={`${product.title} ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-gold">{t('menFootwear')}</p>
            <h1 className="mt-3 font-display text-4xl uppercase leading-[0.95] sm:text-5xl">{product.title}</h1>
            {product.subtitle && <p className="mt-3 text-base text-muted-foreground">{product.subtitle}</p>}

            <div className="mt-6 flex items-baseline gap-4 border-y border-border py-5">
              <span className="font-display text-4xl text-gold">{price}</span>
              {selectedVariant?.sale_price_in_cents != null && (
                <span className="text-xl text-muted-foreground line-through">{originalPrice}</span>
              )}
            </div>

            <div className="prose prose-sm mt-6 max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: product.description }} />

            {product.additional_info?.length > 0 && (
              <div className="mt-6 space-y-4">
                {product.additional_info
                  .sort((a, b) => a.order - b.order)
                  .map((info) => (
                    <div key={info.id} className="border-l-2 border-gold/60 pl-4">
                      <h3 className="text-sm font-bold uppercase tracking-[0.2em]">{info.title}</h3>
                      <div className="prose prose-sm mt-1 text-muted-foreground" dangerouslySetInnerHTML={{ __html: info.description }} />
                    </div>
                  ))}
              </div>
            )}

            {/* Color selector */}
            <div className="mt-7">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.25em]">
                {t('colorsLabel')}: <span className="text-gold">{selectedColor || '—'}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => {
                  const active = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      aria-pressed={active}
                      className={`min-h-[44px] rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                        active
                          ? 'border-2 border-foreground bg-secondary text-foreground'
                          : 'border border-border bg-transparent text-foreground hover:border-foreground/60'
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bata-style size scale */}
            <div className="mt-6">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.25em]">
                {t('sizeLabel')}: <span className="text-gold">{selectedSize || '—'}</span>
              </h3>
              <div className="size-scale">
                {BATA_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    data-size={size}
                    onClick={() => handleSizeSelect(size)}
                    aria-pressed={selectedSize === size}
                    className={`size-box${selectedSize === size ? ' active' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {isBooking ? (
              <div className="mt-8">
                <BookingSlotPicker product={product} variant={selectedVariant} />
                {!product.purchasable && (
                  <p className="mt-3 flex items-center gap-2 text-sm text-destructive">
                    <XCircle size={16} /> Currently unavailable
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="mt-8 flex items-center gap-5">
                  <div className="flex items-center border border-border">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="flex h-11 w-11 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-display text-lg">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="flex h-11 w-11 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {isStockManaged && product.purchasable && (
                    <p className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] ${canAddToCart ? 'text-green-500' : 'text-yellow-500'}`}>
                      {canAddToCart ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {availableStock} {t('inStock')}
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    disabled={!canAddToCart || !product.purchasable}
                    className="w-full rounded-sm bg-primary py-7 text-sm font-bold uppercase tracking-[0.3em] text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-50"
                  >
                    <ShoppingBag className="mr-3 h-5 w-5" />
                    {t('addToCart')}
                  </Button>

                  <Button
                    onClick={handleBuyItNow}
                    disabled={!canAddToCart || !product.purchasable}
                    className="mt-[10px] h-[50px] w-full rounded-sm bg-black text-sm font-bold uppercase tracking-[0.3em] text-white transition-all hover:bg-black/90 active:scale-[0.99] disabled:opacity-50"
                  >
                    BUY IT NOW
                  </Button>

                  {!product.purchasable && (
                    <p className="mt-3 flex items-center justify-center gap-2 text-sm text-destructive">
                      <XCircle size={16} /> Currently unavailable
                    </p>
                  )}
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-gold" /> {t('feature2Title')}
                  </span>
                  <span className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gold" /> {t('feature4Title')}
                  </span>
                </div>
                <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  COD · JazzCash · Easypaisa · Bank Transfer · Card
                </p>
              </>
            )}
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="font-display text-3xl uppercase leading-none sm:text-4xl">{t('relatedTitle')}</h2>
              <Link to="/shop" className="text-xs font-bold uppercase tracking-[0.25em] text-primary transition-colors hover:text-gold">
                {t('viewAll')}
              </Link>
            </div>
            <ProductsList products={related} />
          </section>
        )}
      </div>
    </>
  );
}

export default ProductDetailPage;

import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { placeholderImage } from '@/components/ProductCard';

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get('checkout');
    if (!checkout) return;
    if (checkout === 'success') {
      clearCart();
    }
    params.delete('checkout');
    const newSearch = params.toString();
    const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}${window.location.hash}`;
    window.history.replaceState({}, '', newUrl);
  }, [clearCart]);

  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) {
      toast({
        title: t('cartEmpty'),
        description: t('cartEmptySub'),
        variant: 'destructive',
      });
      return;
    }
    setIsCartOpen(false);
    navigate('/checkout');
  }, [cartItems, toast, t, setIsCartOpen, navigate]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-border bg-card text-card-foreground shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            dir="ltr"
          >
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="font-display text-xl uppercase tracking-wide">
                {t('cartTitle')}
                <span className="ml-2 text-gold">({cartItems.length})</span>
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Close cart"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-grow space-y-4 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="font-display text-lg uppercase tracking-wide">{t('cartEmpty')}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t('cartEmptySub')}</p>
                </div>
              ) : (
                cartItems.map((item) => {
                  const price = item.variant.sale_price_formatted || item.variant.price_formatted;
                  return (
                    <div key={item.variant.id} className="flex gap-4 border border-border bg-secondary/40 p-3">
                      <img
                        src={item.product.image || placeholderImage}
                        alt={item.product.title}
                        className="h-20 w-20 shrink-0 rounded-sm object-cover"
                      />
                      <div className="min-w-0 flex-grow">
                        <h3 className="truncate text-sm font-bold uppercase tracking-wide">{item.product.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.variant.title}</p>
                        {item.size && (
                          <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Size: PK/EU {item.size}</p>
                        )}
                        <p className="mt-1 text-sm font-extrabold text-gold">{price}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center border border-border">
                            <button
                              onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))}
                              className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.variant.id)}
                            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {t('remove')}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-border p-6">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">{t('total')}</span>
                  <span className="font-display text-2xl text-gold">{getCartTotal()}</span>
                </div>
                <p className="mb-4 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  COD · JazzCash · Easypaisa · Bank Transfer · Card
                </p>
                <button
                  onClick={handleCheckout}
                  className="flex w-full items-center justify-center gap-2 bg-primary py-4 text-sm font-bold uppercase tracking-[0.25em] text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.99]"
                >
                  {t('checkout')}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;

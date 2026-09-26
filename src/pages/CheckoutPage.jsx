import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { initializeCheckout } from '@/api/EcommerceApi';
import { useToast } from '@/hooks/use-toast';
import { placeholderImage } from '@/components/ProductCard';
import { supabase } from '@/lib/supabaseClient';
const PHONE_PATTERN = /^03[0-9]{9}$/;

const INPUT_CLASS =
  'w-full rounded-sm border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors';
const LABEL_CLASS =
  'mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground';
const ERROR_CLASS = 'mt-1 text-xs font-semibold text-destructive';

function CheckoutPage() {
  const { toast } = useToast();
  const { cartItems, getCartTotal } = useCart();
  const [form, setForm] = useState({
    name: '',
    phone1: '',
    phone2: '',
    email: '',
    address: '',
    city: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }, []);

  const validate = useCallback(() => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.phone1.trim()) e.phone1 = 'Mobile Number 1 is required';
    else if (!PHONE_PATTERN.test(form.phone1.trim()))
      e.phone1 = 'Enter 11 digits starting with 03 (e.g. 03001234567)';
    if (form.phone2.trim() && !PHONE_PATTERN.test(form.phone2.trim()))
      e.phone2 = 'Enter 11 digits starting with 03';
    if (!form.address.trim()) e.address = 'Delivery address is required';
    if (!form.city.trim()) e.city = 'City is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (cartItems.length === 0) {
        toast({
          title: 'Cart empty',
          description: 'Add a statement pair to begin.',
          variant: 'destructive',
        });
        return;
      }
      if (!validate()) return;

      setSubmitting(true);

      const order = {
        id: `NSZ-${Date.now()}`,
        date: new Date().toISOString(),
        name: form.name.trim(),
        phone1: form.phone1.trim(),
        phone2: form.phone2.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        notes: form.notes.trim(),
        items: cartItems.map((i) => ({
          title: i.product.title,
          variant: i.variant.title,
          size: i.size || '',
          quantity: i.quantity,
          price: i.variant.sale_price_formatted || i.variant.price_formatted,
        })),
        total: getCartTotal(),
        status: 'pending',
      };

      // Save order to Supabase (for admin panel)
      try {
        await supabase.from('orders').insert(
          cartItems.map((i) => ({
            order_id: order.id,
            customer_name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone1.trim(),
            address: `${form.address.trim()}, ${form.city.trim()}`,
            product: i.product.title,
            size: i.size || '',
            color: i.variant.title,
            quantity: i.quantity,
            price: i.variant.sale_price_formatted || i.variant.price_formatted,
          }))
        );
      } catch (supabaseErr) {
        console.error('Supabase order save failed:', supabaseErr);
        // Don't block checkout if this fails
      }
      try {
        const stored = JSON.parse(localStorage.getItem('nsz-orders') || '[]');
        stored.unshift(order);
        localStorage.setItem('nsz-orders', JSON.stringify(stored));

        const items = cartItems.map((i) => ({
          variant_id: i.variant.id,
          quantity: i.quantity,
        }));
        const successUrl = `${window.location.origin}/success?checkout=success&o=${order.id}`;
        const cancelUrl = `${window.location.origin}/checkout`;

        const { url } = await initializeCheckout({ items, successUrl, cancelUrl });
        window.location.href = url;
      } catch (err) {
        setSubmitting(false);
        toast({
          title: 'Checkout',
          description: err.message || 'Checkout failed. Please try again.',
          variant: 'destructive',
        });
      }
    },
    [cartItems, form, validate, getCartTotal, toast],
  );

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <Helmet>
          <title>Checkout — New Shoe Zone | Premium Footwear Sukkur</title>
          <meta name="description" content="Checkout and delivery details for your New Shoe Zone order." />
        </Helmet>
        <ShoppingBag className="mx-auto mb-6 h-12 w-12 text-muted-foreground" />
        <h1 className="font-display text-3xl uppercase">Your cart is empty</h1>
        <p className="mt-3 text-sm text-muted-foreground">Add a statement pair before checking out.</p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <Helmet>
        <title>Checkout — New Shoe Zone | Premium Footwear Sukkur</title>
        <meta name="description" content="Checkout and delivery details for your New Shoe Zone order." />
      </Helmet>

      <Link
        to="/shop"
        className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft size={14} /> Back to Shop
      </Link>

      <h1 className="font-display text-4xl uppercase leading-none sm:text-5xl">Checkout</h1>
      <p className="mt-3 text-sm text-muted-foreground">Delivery details — Cash on Delivery available nationwide.</p>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* Delivery form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-sm border border-border bg-card p-6 sm:p-8"
        >
          <h2 className="font-display text-xl uppercase tracking-wide">Delivery Details</h2>

          <div className="mt-6 space-y-5">
            <div>
              <label className={LABEL_CLASS} htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className={INPUT_CLASS}
              />
              {errors.name && <p className={ERROR_CLASS}>{errors.name}</p>}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={LABEL_CLASS} htmlFor="phone1">Mobile Number 1</label>
                <input
                  id="phone1"
                  name="phone1"
                  type="tel"
                  value={form.phone1}
                  onChange={handleChange}
                  placeholder="Mobile Number 1 (Primary) - 03XX-XXXXXXX"
                  required
                  pattern="^03[0-9]{9}$"
                  className={INPUT_CLASS}
                />
                {errors.phone1 && <p className={ERROR_CLASS}>{errors.phone1}</p>}
              </div>
              <div>
                <label className={LABEL_CLASS} htmlFor="phone2">Mobile Number 2 (Optional)</label>
                <input
                  id="phone2"
                  name="phone2"
                  type="tel"
                  value={form.phone2}
                  onChange={handleChange}
                  placeholder="Mobile Number 2 (Alternative / WhatsApp)"
                  pattern="^03[0-9]{9}$"
                  className={INPUT_CLASS}
                />
                {errors.phone2 && <p className={ERROR_CLASS}>{errors.phone2}</p>}
              </div>
            </div>

            <div>
              <label className={LABEL_CLASS} htmlFor="email">Email (Optional)</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label className={LABEL_CLASS} htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                value={form.city}
                onChange={handleChange}
                placeholder="e.g. Sukkur, Karachi, Lahore"
                required
                className={INPUT_CLASS}
              />
              {errors.city && <p className={ERROR_CLASS}>{errors.city}</p>}
            </div>

            <div>
              <label className={LABEL_CLASS} htmlFor="address">Delivery Address</label>
              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="House / Street / Area / Landmark"
                required
                rows={3}
                className={INPUT_CLASS}
              />
              {errors.address && <p className={ERROR_CLASS}>{errors.address}</p>}
            </div>

            <div>
              <label className={LABEL_CLASS} htmlFor="notes">Order Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Any delivery instructions"
                rows={2}
                className={INPUT_CLASS}
              />
            </div>
          </div>
        </motion.div>

        {/* Order summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-sm border border-border bg-card p-6 sm:p-8"
        >
          <h2 className="font-display text-xl uppercase tracking-wide">Order Summary</h2>

          <div className="mt-6 space-y-4">
            {cartItems.map((item) => {
              const price = item.variant.sale_price_formatted || item.variant.price_formatted;
              return (
                <div key={item.variant.id} className="flex gap-4 border-b border-border pb-4">
                  <img
                    src={item.product.image || placeholderImage}
                    alt={item.product.title}
                    className="h-16 w-16 shrink-0 rounded-sm object-cover"
                  />
                  <div className="min-w-0 flex-grow">
                    <h3 className="truncate text-sm font-bold uppercase tracking-wide">{item.product.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.variant.title}</p>
                    {item.size && (
                      <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Size: PK/EU {item.size}</p>
                    )}
                    <p className="mt-1 text-sm font-extrabold text-gold">{price} × {item.quantity}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">Total</span>
            <span className="font-display text-2xl text-gold">{getCartTotal()}</span>
          </div>

          <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            COD · JazzCash · Easypaisa · Bank Transfer · Card
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 flex w-full items-center justify-center gap-2 bg-primary py-4 text-sm font-bold uppercase tracking-[0.25em] text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}
            {submitting ? 'Processing…' : 'Place Order'}
          </button>

          <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-gold" /> Authentic pairs</span>
            <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-gold" /> Nationwide delivery</span>
          </div>
        </motion.div>
      </form>
    </div>
  );
}

export default CheckoutPage;

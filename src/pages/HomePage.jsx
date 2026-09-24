import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Gem, BadgeCheck, Crown, Truck, Check, Phone } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import ProductsList from '@/components/ProductsList';
import { useProducts, getTabProducts } from '@/hooks/useProducts';
import { useLanguage } from '@/contexts/LanguageContext';

const HERO_IMAGE = 'https://images.hostinger.com/0c01af08-ac33-4063-b00f-29a41550e318.png';

const HomePage = () => {
  const { t } = useLanguage();
  const { products, loading, error } = useProducts();
  const [tab, setTab] = useState('new');

  const tabs = [
    { value: 'new', label: t('newArrivals') },
    { value: 'best', label: t('bestSellers') },
    { value: 'premium', label: t('premiumSelection') },
    { value: 'limited', label: t('limitedEdition') },
  ];

  const features = [
    { icon: Gem, title: t('feature1Title'), desc: t('feature1Desc') },
    { icon: BadgeCheck, title: t('feature2Title'), desc: t('feature2Desc') },
    { icon: Crown, title: t('feature3Title'), desc: t('feature3Desc') },
    { icon: Truck, title: t('feature4Title'), desc: t('feature4Desc') },
  ];

  const whyPoints = [t('why1'), t('why2'), t('why3'), t('why4'), t('why5')];

  const stats = [
    { value: 20, suffix: '+', label: t('premiumSelection') },
    { value: 5, suffix: '', label: t('paymentsTitle') },
    { value: 7, suffix: '', label: t('why5').split(' ').slice(0, 2).join(' ') },
    { value: 100, suffix: '%', label: t('feature2Title') },
  ];

  return (
    <>
      <Helmet>
        <title>New Shoe Zone — Step Into Luxury | Premium Footwear Sukkur</title>
        <meta
          name="description"
          content="New Shoe Zone by Shah Traders — Sukkur's house of premium men's footwear. Authentic luxury shoes from PKR 1,999–3,999 with COD, JazzCash, Easypaisa and card payments, delivered nationwide."
        />
      </Helmet>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-white text-black">
        <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-primary/15 blur-[140px] animate-glow-pulse" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-gold/20 blur-[120px]" />

        <div className="mx-auto grid min-h-[92dvh] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative z-10"
          >
            <p className="mb-5 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.35em] text-gold">
              <span className="h-px w-10 bg-gold" />
              {t('heroKicker')}
            </p>
            <h1 className="font-display text-5xl uppercase leading-[0.95] sm:text-6xl lg:text-7xl">
              {t('heroTitleA')}
              <span className="mt-1 block text-gold-gradient">{t('heroTitleB')}</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-black/60">{t('heroSub')}</p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-3 bg-primary px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] text-primary-foreground transition-all duration-300 hover:bg-black hover:text-white active:scale-[0.98]"
              >
                {t('shopPremium')}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
              <a
                href="#featured"
                className="inline-flex items-center gap-3 border border-black/25 px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] text-black/80 transition-all duration-300 hover:border-gold hover:text-gold"
              >
                {t('collections')}
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">
              <span>COD</span>
              <span className="text-gold">◆</span>
              <span>JazzCash</span>
              <span className="text-gold">◆</span>
              <span>Easypaisa</span>
              <span className="text-gold">◆</span>
              <span>Bank Transfer</span>
              <span className="text-gold">◆</span>
              <span>Card</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
            className="relative"
          >
            <div className="absolute -inset-3 border border-gold/30" />
            <div className="absolute -bottom-5 -right-5 h-full w-full border border-primary/40" />
            <img
              src={HERO_IMAGE}
              alt="Premium black and red luxury sneaker — New Shoe Zone"
              className="relative aspect-[4/3] w-full object-cover shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
            />
            <div className="absolute bottom-4 left-4 bg-black/80 px-4 py-2 backdrop-blur">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">{t('limitedEdition')}</span>
              <p className="font-display text-lg uppercase tracking-wide text-white">Crown Limited Edition</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="overflow-hidden border-y border-border bg-card py-3">
        <div className="flex whitespace-nowrap animate-marquee-x">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex shrink-0 items-center font-display text-sm uppercase tracking-[0.3em] text-muted-foreground">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="mx-8 flex items-center gap-8">
                  <span>{t('newArrivals')}</span>
                  <span className="text-primary">◆</span>
                  <span>{t('premiumSelection')}</span>
                  <span className="text-gold">◆</span>
                  <span>{t('priceRange')}</span>
                  <span className="text-primary">◆</span>
                  <span>Sukkur · Sindh</span>
                  <span className="text-gold">◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ============ FEATURED COLLECTIONS (TABS) ============ */}
      <section id="featured" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal>
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.35em] text-primary">{t('menFootwear')}</p>
              <h2 className="font-display text-4xl uppercase leading-none sm:text-5xl">{t('featuredTitle')}</h2>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">{t('featuredSub')}</p>
          </div>
        </Reveal>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-10 flex h-auto w-full flex-wrap justify-start gap-0 rounded-none border-b border-border bg-transparent p-0">
            {tabs.map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="relative rounded-none px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:scale-x-0 after:bg-primary after:transition-transform data-[state=active]:after:scale-x-100"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map(({ value }) => (
            <TabsContent key={value} value={value} className="mt-0">
              <ProductsList products={getTabProducts(products, value)} loading={loading} error={error} />
            </TabsContent>
          ))}
        </Tabs>

        <Reveal className="mt-14 text-center">
          <Link
            to="/shop"
            className="group inline-flex items-center gap-3 border border-foreground/20 px-10 py-4 text-sm font-bold uppercase tracking-[0.25em] transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            {t('viewAll')}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </Reveal>
      </section>

      {/* ============ LUXURY FEATURES ============ */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="group flex h-full flex-col gap-4 border-b border-border p-8 transition-colors last:border-b-0 hover:bg-secondary/50 sm:border-b-0 sm:border-l sm:first:border-l-0 lg:p-10">
                <span className="flex h-12 w-12 items-center justify-center border border-gold/40 text-gold transition-all duration-300 group-hover:bg-gold group-hover:text-black">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="font-display text-lg uppercase tracking-wide">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ WHY CHOOSE ============ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.35em] text-gold">{t('owner')}</p>
            <h2 className="font-display text-4xl uppercase leading-[0.95] sm:text-5xl">
              {t('whyTitle')}
            </h2>
            <ul className="mt-10 space-y-5">
              {whyPoints.map((point) => (
                <li key={point} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center bg-primary text-primary-foreground">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-base font-medium text-foreground/85">{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative bg-[#070707] p-10 text-white lg:p-14">
              <div className="absolute -left-3 -top-3 h-16 w-16 border-l-2 border-t-2 border-gold" />
              <div className="absolute -bottom-3 -right-3 h-16 w-16 border-b-2 border-r-2 border-primary" />
              <div className="grid grid-cols-2 gap-x-6 gap-y-12">
                {stats.map(({ value, suffix, label }) => (
                  <div key={label}>
                    <p className="font-display text-5xl text-gold-gradient">
                      <CountUp value={value} suffix={suffix} />
                    </p>
                    <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">{label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-12 border-t border-white/10 pt-6 text-sm leading-relaxed text-white/50">{t('sizingHelp')}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ CTA BAND ============ */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-black/20 blur-3xl" />
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-16 text-center sm:px-6 lg:py-20">
          <Reveal>
            <h2 className="font-display text-4xl uppercase leading-none sm:text-5xl">
              {t('heroTitleA')} <span className="text-black">{t('heroTitleB')}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 bg-black px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-white hover:text-black active:scale-[0.98]"
              >
                {t('exploreShop')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:+923183585353"
                className="inline-flex items-center gap-3 border border-white/40 px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] transition-all duration-300 hover:border-black hover:text-black"
              >
                <Phone className="h-4 w-4" />
                +92 318 3585353
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default HomePage;

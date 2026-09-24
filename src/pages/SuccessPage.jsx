import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const SuccessPage = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>Order Confirmed — New Shoe Zone</title>
        <meta name="description" content="Your New Shoe Zone order has been confirmed. Our team will contact you shortly to arrange delivery." />
      </Helmet>

      <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:py-32">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 16 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary"
        >
          <CheckCircle className="h-10 w-10" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h1 className="mt-8 font-display text-4xl uppercase leading-none sm:text-5xl">{t('orderSuccess')}</h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">{t('orderSuccessSub')}</p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 bg-primary px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] text-primary-foreground transition-all duration-300 hover:bg-primary/90 active:scale-[0.98]"
            >
              {t('continueShopping')}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
            <a
              href="https://wa.me/923183585353"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 border border-border px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] text-foreground transition-all duration-300 hover:border-gold hover:text-gold"
            >
              WhatsApp
            </a>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default SuccessPage;

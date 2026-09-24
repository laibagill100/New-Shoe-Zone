import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Banknote, CreditCard, Landmark, Wallet } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TikTokIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const Footer = () => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const payments = [
    { icon: Banknote, label: 'Cash on Delivery' },
    { icon: Wallet, label: 'JazzCash' },
    { icon: Wallet, label: 'Easypaisa' },
    { icon: Landmark, label: 'Bank Transfer' },
    { icon: CreditCard, label: 'Debit / Credit Card' },
  ];

  return (
    <footer className="border-t border-border bg-card">
      {/* Payment strip */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-8 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold">{t('paymentsTitle')}</span>
          {payments.map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Icon className="h-5 w-5 text-foreground/70" />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        {/* Brand */}
        <div>
          <div>
            <img
              src="https://horizons-cdn.hostinger.com/9c503065-c933-4ace-932d-93bf6fa4b3a2/3fe55233bf7c3cc9b605aeb660ec5529.jpg"
              alt="New Shoe Zone logo"
              className="h-28 w-28 rounded-full object-cover"
            />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {t('heroSub')}
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-gold">{t('owner')}</p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-foreground">{t('contactTitle')}</h3>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{t('address')}</span>
            </li>
            <li>
              <a href="tel:+923183585353" className="flex items-center gap-3 transition-colors hover:text-primary">
                <Phone className="h-4 w-4 shrink-0 text-primary" /> +92 318 3585353
              </a>
            </li>
            <li>
              <a href="mailto:support@newshoezone.com" className="flex items-center gap-3 transition-colors hover:text-primary">
                <Mail className="h-4 w-4 shrink-0 text-primary" /> support@newshoezone.com
              </a>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-foreground">{t('followUs')}</h3>
          <div className="mt-5 flex gap-3">
            <a
              href="https://instagram.com/shoezone0301"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram @shoezone0301"
              className="flex h-11 w-11 items-center justify-center rounded-sm border border-border text-foreground/70 transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://tiktok.com/@shoezone031"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok @shoezone031"
              className="flex h-11 w-11 items-center justify-center rounded-sm border border-border text-foreground/70 transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
            <a
              href="https://facebook.com/shoezone"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook /shoezone"
              className="flex h-11 w-11 items-center justify-center rounded-sm border border-border text-foreground/70 transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Facebook className="h-5 w-5" />
            </a>
          </div>
          <nav className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-primary">{t('home')}</Link>
            <Link to="/shop" className="transition-colors hover:text-primary">{t('shop')}</Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <span>© {year} New Shoe Zone — {t('owner')}. Sukkur, Sindh, Pakistan.</span>
          <span className="uppercase tracking-[0.25em] text-gold">{t('priceRange')}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

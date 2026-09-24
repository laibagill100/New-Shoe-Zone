import React, { useState, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Sun, Moon, Menu, Phone } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const LOGO_SRC =
  'https://horizons-cdn.hostinger.com/9c503065-c933-4ace-932d-93bf6fa4b3a2/3fe55233bf7c3cc9b605aeb660ec5529.jpg';

const LOGO_ALT = 'New Shoe Zone logo';

const Logo = ({ className = '' }) => (
  <Link to="/" className={`group flex items-center justify-center ${className}`} aria-label="Shoe Zone home">
    <img
      src={LOGO_SRC}
      alt={LOGO_ALT}
      className="h-[50px] w-[50px] rounded-full object-cover transition-transform duration-300 group-hover:scale-[1.02] sm:h-[65px] sm:w-[65px]"
    />
  </Link>
);

const Header = ({ onCartOpen }) => {
  const { theme, setTheme } = useTheme();
  const { cartItems } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      const q = query.trim();
      navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
      setQuery('');
    },
    [query, navigate],
  );

  const navLinkClass = ({ isActive }) =>
    `text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:text-primary ${
      isActive ? 'text-primary' : 'text-foreground/70'
    }`;

  return (
    <header className="sticky top-0 z-40">
      {/* Promo bar */}
      <div className="bg-primary text-primary-foreground overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee-x py-1.5">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex shrink-0 items-center text-[11px] font-semibold uppercase tracking-[0.25em]">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="mx-6 flex items-center gap-6">
                  <span>{t('promo')}</span>
                  <span className="text-gold">◆</span>
                  <span>{t('priceRange')}</span>
                  <span className="text-gold">◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Main bar — 3-column: nav | centered logo | actions */}
      <div className="border-b border-border bg-background/90 backdrop-blur-md">
        <div className="relative mx-auto grid h-[60px] max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-[15px] py-[5px] sm:h-[70px] sm:gap-4 sm:px-5">
          {/* Left: mobile menu + desktop nav */}
          <div className="flex items-center justify-start gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-background">
                <div className="mt-4 flex flex-col gap-6">
                  <Logo className="self-start" />
                  <SheetClose asChild><NavLink to="/" className={navLinkClass}>{t('home')}</NavLink></SheetClose>
                  <SheetClose asChild><NavLink to="/shop" className={navLinkClass}>{t('shop')}</NavLink></SheetClose>
                  <SheetClose asChild><NavLink to="/shop?tab=premium" className={navLinkClass}>{t('collections')}</NavLink></SheetClose>
                  <a href="tel:+923183585353" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70">
                    <Phone className="h-4 w-4 text-primary" /> +92 318 3585353
                  </a>
                </div>
              </SheetContent>
            </Sheet>

            <nav className="hidden items-center gap-6 md:flex lg:gap-8">
              <NavLink to="/" className={navLinkClass} end>{t('home')}</NavLink>
              <NavLink to="/shop" className={navLinkClass}>{t('shop')}</NavLink>
              <a href="/#featured" className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:text-primary">
                {t('collections')}
              </a>
            </nav>
          </div>

          {/* Center logo — absolute on small screens so true center; grid cell on md+ */}
          <div className="pointer-events-none absolute inset-x-0 z-[1] flex justify-center md:pointer-events-auto md:static md:z-auto md:justify-center">
            <Logo className="pointer-events-auto z-[1] md:z-10" />
          </div>

          {/* Right actions — mobile: absolute right corner above logo; desktop: grid flow */}
          <div className="absolute right-[15px] top-1/2 z-[9999] flex -translate-y-1/2 items-center gap-3 md:relative md:right-auto md:top-auto md:z-auto md:translate-y-0 md:justify-end md:gap-2">
            <form onSubmit={handleSearch} className="relative hidden lg:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="h-9 w-40 rounded-sm border border-border bg-secondary/60 pl-9 pr-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:w-56 focus:border-primary xl:w-48 xl:focus:w-64"
                aria-label={t('searchPlaceholder')}
              />
            </form>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle dark mode"
              className="relative z-[10000] text-foreground/80 hover:text-gold"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onCartOpen}
              aria-label={t('cartTitle')}
              className="relative z-[10000] text-foreground/80 hover:text-primary"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="relative border-t border-border px-4 py-2 sm:hidden">
          <Search className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="h-9 w-full rounded-sm border border-border bg-secondary/60 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
            aria-label={t('searchPlaceholder')}
          />
        </form>
      </div>
    </header>
  );
};

export default Header;

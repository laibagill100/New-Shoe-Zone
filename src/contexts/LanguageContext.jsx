import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const LanguageContext = createContext();

const STORAGE_KEY = 'nsz-language';

const translations = {
  en: {
    home: 'Home',
    shop: 'Shop',
    collections: 'Collections',
    contact: 'Contact',
    searchPlaceholder: 'Search premium shoes…',
    promo: 'Exclusive Premium Footwear — Cash on Delivery Nationwide',
    heroKicker: 'Sukkur’s House of Premium Footwear',
    heroTitleA: 'Step Into Luxury.',
    heroTitleB: 'Own Your Statement.',
    heroSub: 'Hand-picked premium men’s footwear from PKR 1,999 – 3,999. Authentic pairs, bold silhouettes, delivered to your door anywhere in Pakistan.',
    shopPremium: 'Shop Premium Collection',
    exploreShop: 'Explore the Shop',
    newArrivals: 'New Arrivals',
    bestSellers: 'Best Sellers',
    premiumSelection: 'Premium Selection',
    limitedEdition: 'Limited Edition',
    quickView: 'Quick View',
    addToCart: 'Add to Cart',
    buyItNow: 'Buy It Now',
    viewAll: 'View All',
    featuredTitle: 'Featured Collections',
    featuredSub: 'Four curated rails. One standard: statement luxury.',
    featuresTitle: 'The New Shoe Zone Standard',
    feature1Title: 'Premium Materials',
    feature1Desc: 'Full-grain leathers, engineered knits and cushioned soles — inspected pair by pair.',
    feature2Title: 'Authentic Brands',
    feature2Desc: 'Every pair verified authentic by Shah Traders before it reaches the shelf.',
    feature3Title: 'Expert Curation',
    feature3Desc: 'A tight, seasonal edit of 15–20 silhouettes. No filler, only statements.',
    feature4Title: 'Guaranteed Delivery',
    feature4Desc: 'Tracked nationwide shipping across Pakistan with careful, gift-grade packaging.',
    whyTitle: 'Why Choose New Shoe Zone',
    why1: 'Authentic premium footwear, verified in-house',
    why2: 'Sukkur’s boldest luxury selection under one roof',
    why3: 'Cash on Delivery, JazzCash, Easypaisa, bank transfer & cards',
    why4: 'WhatsApp concierge for sizing and styling advice',
    why5: '7-day easy exchange on unworn pairs',
    shopTitle: 'The Full Collection',
    shopSub: 'Every silhouette in the house. Filter, search, find your statement.',
    allCategories: 'All',
    sortFeatured: 'Featured',
    sortPriceLow: 'Price: Low to High',
    sortPriceHigh: 'Price: High to Low',
    sortName: 'Name A–Z',
    noResults: 'No shoes match your search.',
    resultsFor: 'results for',
    cartTitle: 'Your Cart',
    cartEmpty: 'Your cart is empty.',
    cartEmptySub: 'Add a statement pair to begin.',
    total: 'Total',
    checkout: 'Proceed to Checkout',
    remove: 'Remove',
    paymentsTitle: 'We Accept',
    orderSuccess: 'Order Confirmed',
    orderSuccessSub: 'Thank you for shopping with New Shoe Zone. Our team will contact you shortly to confirm delivery.',
    continueShopping: 'Continue Shopping',
    contactTitle: 'Visit or Reach Us',
    address: 'Main Ghanta Ghar, Mehran Markaz, Shop No 7, Near Dolphin Bakery, Opposite Student Restaurant, Sukkur',
    owner: 'New Shoe Zone · Sukkur',
    followUs: 'Follow the Zone',
    sizingHelp: 'Need sizing help? Chat with us on WhatsApp.',
    inStock: 'in stock',
    selectSize: 'Select option',
    colorsLabel: 'Colors',
    sizeLabel: 'Size',
    backToShop: 'Back to Shop',
    relatedTitle: 'Complete the Look',
    limitedBadge: 'Limited',
    newBadge: 'New',
    saleBadge: 'Hot',
    language: 'اردو',
    addedToCart: 'Added to cart',
    menFootwear: 'Men’s Footwear',
    priceRange: 'PKR 1,999 – 3,999',
  },
  ur: {
    home: 'ہوم',
    shop: 'شاپ',
    collections: 'کلیکشن',
    contact: 'رابطہ',
    searchPlaceholder: 'پریمیم جوتے تلاش کریں…',
    promo: 'خصوصی پریمیم جوتے — پورے پاکستان میں کیش آن ڈیلیوری',
    heroKicker: 'سکھر کا پریمیم فٹویئر ہاؤس',
    heroTitleA: 'لگژری میں قدم رکھیں۔',
    heroTitleB: 'اپنی پہچان بنائیں۔',
    heroSub: 'منتخب پریمیم مردانہ جوتے، صرف 1,999 تا 3,999 روپے۔ اصل جوڑے، دلیرانہ ڈیزائن، پاکستان بھر میں آپ کے دروازے تک۔',
    shopPremium: 'پریمیم کلیکشن خریدیں',
    exploreShop: 'شاپ دیکھیں',
    newArrivals: 'نئی آمد',
    bestSellers: 'مقبول ترین',
    premiumSelection: 'پریمیم انتخاب',
    limitedEdition: 'لمٹیڈ ایڈیشن',
    quickView: 'فوری نظارہ',
    addToCart: 'کارٹ میں ڈالیں',
    buyItNow: 'ابھی خریدیں',
    viewAll: 'سب دیکھیں',
    featuredTitle: 'نمایاں کلیکشنز',
    featuredSub: 'چار منتخب سلسلے۔ ایک معیار: لگژری انداز۔',
    featuresTitle: 'نیو شو زون کا معیار',
    feature1Title: 'پریمیم مواد',
    feature1Desc: 'اصل چمڑا، جدید نِٹ اور نرم سول — ہر جوڑے کی جانچ کے بعد۔',
    feature2Title: 'اصلی برانڈز',
    feature2Desc: 'ہر جوڑا شاہ ٹریڈرز کی جانب سے تصدیق شدہ۔',
    feature3Title: 'ماہر انتخاب',
    feature3Desc: 'ہر سیزن صرف 15–20 منتخب ڈیزائن۔ کوئی فضول نہیں، صرف بہترین۔',
    feature4Title: 'یقینی ڈیلیوری',
    feature4Desc: 'پاکستان بھر میں محتاط پیکنگ کے ساتھ ٹریک شدہ ڈیلیوری۔',
    whyTitle: 'نیو شو زون ہی کیوں',
    why1: 'اصلی پریمیم جوتے، ہمارے ہاں تصدیق شدہ',
    why2: 'سکھر کا سب سے دلیر لگژری انتخاب ایک ہی چھت تلے',
    why3: 'کیش آن ڈیلیوری، جاز کیش، ایزی پیسہ، بینک ٹرانسفر اور کارڈ',
    why4: 'سائز اور اسٹائل مشورے کے لیے واٹس ایپ سہولت',
    why5: 'غیر استعمال شدہ جوڑوں پر 7 دن کی آسان تبدیلی',
    shopTitle: 'مکمل کلیکشن',
    shopSub: 'ہمارے تمام ڈیزائن۔ تلاش کریں، منتخب کریں، اپنا انداز پائیں۔',
    allCategories: 'سب',
    sortFeatured: 'نمایاں',
    sortPriceLow: 'قیمت: کم سے زیادہ',
    sortPriceHigh: 'قیمت: زیادہ سے کم',
    sortName: 'نام الف تا ی',
    noResults: 'آپ کی تلاش سے کوئی جوتا نہیں ملا۔',
    resultsFor: 'نتائج برائے',
    cartTitle: 'آپ کا کارٹ',
    cartEmpty: 'آپ کا کارٹ خالی ہے۔',
    cartEmptySub: 'ایک شاندار جوڑا منتخب کر کے شروع کریں۔',
    total: 'کل رقم',
    checkout: 'چیک آؤٹ کریں',
    remove: 'ہٹائیں',
    paymentsTitle: 'ادائیگی کے طریقے',
    orderSuccess: 'آرڈر کی تصدیق ہو گئی',
    orderSuccessSub: 'نیو شو زون سے خریداری کا شکریہ۔ ہماری ٹیم جلد ڈیلیوری کی تصدیق کے لیے رابطہ کرے گی۔',
    continueShopping: 'خریداری جاری رکھیں',
    contactTitle: 'ہم سے ملیں یا رابطہ کریں',
    address: 'مین گھنٹہ گھر، مہران مرکز، شاپ نمبر 7، ڈولفن بیکری کے قریب، اسٹوڈنٹ ریستوران کے سامنے، سکھر',
    owner: 'نیو شو زون · سکھر',
    followUs: 'ہمیں فالو کریں',
    sizingHelp: 'سائز میں مدد چاہیے؟ واٹس ایپ پر بات کریں۔',
    inStock: 'موجود',
    selectSize: 'انتخاب کریں',
    colorsLabel: 'رنگ',
    sizeLabel: 'سائز',
    backToShop: 'شاپ پر واپس',
    relatedTitle: 'مکمل انداز',
    limitedBadge: 'لمٹیڈ',
    newBadge: 'نیا',
    saleBadge: 'ہاٹ',
    language: 'English',
    addedToCart: 'کارٹ میں شامل ہو گیا',
    menFootwear: 'مردانہ جوتے',
    priceRange: '1,999 – 3,999 روپے',
  },
};

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = useCallback((key) => translations[lang][key] ?? translations.en[key] ?? key, [lang]);

  const value = useMemo(
    () => ({ lang, setLang, t, isRtl: lang === 'ur' }),
    [lang, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

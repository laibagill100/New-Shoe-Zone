import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { CartProvider } from '@/hooks/useCart';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/toaster';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SuccessPage from './pages/SuccessPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminOrdersPage from './pages/AdminOrdersPage';

function App() {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <LanguageProvider>
                <CartProvider>
                    <Router>
                        <ScrollToTop />
                        <Routes>
                            <Route element={<Layout />}>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/shop" element={<ShopPage />} />
                                <Route path="/product/:id" element={<ProductDetailPage />} />
                                <Route path="/success" element={<SuccessPage />} />
                                <Route path="/checkout" element={<CheckoutPage />} />
                                <Route path="/admin/orders" element={<AdminOrdersPage />} />
                                <Route path="*" element={<HomePage />} />
                            </Route>
                        </Routes>
                        <Toaster />
                    </Router>
                </CartProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}

export default App;

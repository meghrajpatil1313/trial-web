import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { motion } from 'motion/react';
import { seedMockData } from './lib/seed';

// Footer component
const Footer = () => (
  <footer className="bg-gray-50 pt-24 pb-12 border-t border-gray-100">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-2xl font-bold tracking-tighter mb-6">VELOX</h2>
          <p className="text-gray-500 max-w-sm leading-relaxed mb-8">
            Providing modern essentials for the simplified lifestyle. Quality, speed, and design at the heart of everything we do.
          </p>
          <div className="flex gap-4">
            {['Instagram', 'Twitter', 'Facebook'].map(s => (
              <a key={s} href="#" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">{s}</a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Shop</h4>
          <ul className="flex flex-col gap-4">
            <li><a href="/products" className="text-sm font-medium hover:text-gray-600">All Products</a></li>
            <li><a href="/category/tech" className="text-sm font-medium hover:text-gray-600">Tech</a></li>
            <li><a href="/category/accessories" className="text-sm font-medium hover:text-gray-600">Accessories</a></li>
            <li><a href="#" className="text-sm font-medium hover:text-gray-600">Sale</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Support</h4>
          <ul className="flex flex-col gap-4">
            <li><a href="#" className="text-sm font-medium hover:text-gray-600">Shipping Policy</a></li>
            <li><a href="#" className="text-sm font-medium hover:text-gray-600">Return Policy</a></li>
            <li><a href="#" className="text-sm font-medium hover:text-gray-600">Contact Us</a></li>
            <li><a href="#" className="text-sm font-medium hover:text-gray-600">FAQ</a></li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200 gap-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">© 2026 VELOX SHOP. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          {['Privacy', 'Terms', 'Cookies'].map(s => (
            <a key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">{s}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  React.useEffect(() => {
    seedMockData();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-white selection:bg-black selection:text-white">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Shop />} />
                <Route path="/category/:categoryId" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

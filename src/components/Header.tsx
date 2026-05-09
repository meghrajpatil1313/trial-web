import React from 'react';
import { ShoppingBag, User, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export const Header = () => {
  const { profile, login, logout } = useAuth();
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const cartCount = items.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
            VELOX
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Shop All</Link>
            <Link to="/category/tech" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Tech</Link>
            <Link to="/category/accessories" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Accessories</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {profile ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={logout}
                className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-200">
                <img src={profile.photoURL} alt={profile.displayName} referrerPolicy="no-referrer" />
              </div>
            </div>
          ) : (
            <button 
              onClick={login}
              className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
            >
              <User size={18} />
              <span>Sign In</span>
            </button>
          )}

          <Link to="/cart" className="relative p-2 text-gray-600 hover:text-black transition-colors">
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          <button 
            className="md:hidden p-2 text-gray-600 hover:text-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 bg-white border-bottom border-gray-100 md:hidden overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              <Link to="/products" className="flex items-center justify-between py-2 text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                Shop All <ChevronRight size={18} />
              </Link>
              <Link to="/category/tech" className="flex items-center justify-between py-2 text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                Tech <ChevronRight size={18} />
              </Link>
              <Link to="/category/accessories" className="flex items-center justify-between py-2 text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                Accessories <ChevronRight size={18} />
              </Link>
              <hr />
              {!profile ? (
                <button 
                  onClick={() => { login(); setIsMenuOpen(false); }}
                  className="w-full bg-black text-white py-3 rounded-lg font-medium"
                >
                  Sign In
                </button>
              ) : (
                <button 
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                  className="w-full border border-gray-200 py-3 rounded-lg font-medium"
                >
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

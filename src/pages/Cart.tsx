import React from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export const Cart = () => {
  const { items, updateQuantity, removeItem, total } = useCart();
  const { profile, login } = useAuth();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-48 pb-24 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-400">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-4xl font-bold tracking-tight uppercase mb-4">Your bag is empty</h1>
        <p className="text-gray-500 mb-10 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet. Let's find something for you.</p>
        <Link to="/products" className="inline-flex items-center gap-2 px-10 py-4 bg-black text-white rounded-full font-bold uppercase tracking-tight hover:bg-gray-900">
          Start Shopping <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-24">
      <h1 className="text-5xl font-bold tracking-tighter uppercase mb-12">Your Bag</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 flex flex-col gap-8">
          {items.map((item) => (
            <motion.div 
              layout
              key={item.id}
              className="flex gap-6 pb-8 border-b border-gray-100 last:border-0"
            >
              <div className="w-32 h-40 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-grow flex flex-col justify-between py-1">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.category}</span>
                    <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                  <h3 className="text-xl font-medium mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-2xl p-8 sticky top-32">
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-8">Summary</h2>
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-4 border-t border-gray-200">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {profile ? (
              <button 
                className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-tight hover:bg-gray-900 flex items-center justify-center gap-2"
                onClick={() => alert("Checkout integration coming soon!")}
              >
                Checkout <ArrowRight size={20} />
              </button>
            ) : (
              <button 
                onClick={login}
                className="w-full border border-black py-4 rounded-full font-bold uppercase tracking-tight hover:bg-black hover:text-white transition-colors"
              >
                Sign in to checkout
              </button>
            )}
            
            <p className="text-[10px] text-gray-400 text-center mt-6 uppercase tracking-widest">
              By checking out you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

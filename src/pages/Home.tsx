import React, { useEffect, useState } from 'react';
import { collection, query, limit, onSnapshot, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const Home = () => {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'products'), where('featured', '==', true), limit(8));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFeatured(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070" 
            className="w-full h-full object-cover opacity-10"
            alt="Hero background"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.9] mb-8">
                ESSENTIALS FOR THE <span className="text-gray-300">MODERN</span> LIVING
              </h1>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed"
            >
              Discover our curated collection of high-performance tech and accessories designed for those who value speed, style, and simplicity.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/products" className="px-8 py-4 bg-black text-white rounded-full font-bold uppercase tracking-tight flex items-center gap-2 hover:bg-gray-900 transition-colors">
                Explore Collection <ArrowRight size={20} />
              </Link>
              <Link to="/category/tech" className="px-8 py-4 border border-gray-200 rounded-full font-bold uppercase tracking-tight hover:bg-gray-50 transition-colors">
                View Tech
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2 uppercase">Featured</h2>
            <p className="text-gray-500">The most wanted items this season.</p>
          </div>
          <Link to="/products" className="hidden md:flex items-center gap-2 font-bold uppercase text-xs tracking-widest hover:translate-x-1 transition-transform">
            Shop All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.length > 0 ? (
            featured.map(p => <ProductCard key={p.id} product={p} />)
          ) : (
            // Skeleton / Placeholder if empty
            [1,2,3,4].map(i => (
              <div key={i} className="aspect-[4/5] bg-gray-100 rounded-2xl animate-pulse" />
            ))
          )}
        </div>
      </section>

      {/* Trust Markers */}
      <section className="bg-black py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="flex flex-col gap-6 items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white">
              <Zap size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Rapid Delivery</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Free international shipping on all orders over $150. Experience the Velox speed.</p>
            </div>
          </div>
          <div className="flex flex-col gap-6 items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white">
              <Shield size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Secure Payment</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Your security is our priority. Encrypted transactions for your peace of mind.</p>
            </div>
          </div>
          <div className="flex flex-col gap-6 items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white">
              <Sparkles size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Premium Quality</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Every piece is handpicked and quality-checked before it leaves our warehouse.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { useParams } from 'react-router-dom';
import { SlidersHorizontal, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatPrice } from '../lib/utils';

export const Shop = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter States
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let q = query(collection(db, 'products'));
        if (categoryId) {
          q = query(collection(db, 'products'), where('category', '==', categoryId));
        }
        const snapshot = await getDocs(q);
        setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
        const matchesStock = onlyInStock ? p.stock > 0 : true;
        return matchesPrice && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0; // 'latest' - would need a date field for true sorting, assuming ID or fetch order for now
      });
  }, [products, minPrice, maxPrice, onlyInStock, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-24 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-bold tracking-tighter uppercase mb-2">
            {categoryId ? categoryId : 'The Collection'}
          </h1>
          <p className="text-gray-500">Showing {filteredProducts.length} items</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className={cn(
              "flex items-center gap-2 px-6 py-2 border rounded-full text-sm font-bold uppercase tracking-tight transition-all",
              isFilterOpen || minPrice > 0 || maxPrice < 2000 || onlyInStock 
                ? "bg-black text-white border-black" 
                : "bg-transparent border-gray-200 hover:bg-gray-50 text-black"
            )}
          >
            <SlidersHorizontal size={16} /> 
            {isFilterOpen ? 'Filtering' : 'Filter'}
          </button>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border border-gray-200 rounded-full px-6 py-2 text-sm font-bold uppercase tracking-tight focus:outline-none appearance-none cursor-pointer hover:bg-gray-50"
          >
            <option value="latest">Latest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-[70] shadow-2xl p-8 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl font-bold uppercase tracking-tight">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-12">
                {/* Price Filter */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-grow">
                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Min</label>
                        <input 
                          type="number" 
                          value={minPrice} 
                          onChange={(e) => setMinPrice(Number(e.target.value))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                        />
                      </div>
                      <div className="flex-grow">
                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Max</label>
                        <input 
                          type="number" 
                          value={maxPrice} 
                          onChange={(e) => setMaxPrice(Number(e.target.value))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="2000" 
                      step="50"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                      <span>$0</span>
                      <span>$2000+</span>
                    </div>
                  </div>
                </div>

                {/* Availability Filter */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Availability</h3>
                  <button 
                    onClick={() => setOnlyInStock(!onlyInStock)}
                    className="flex items-center gap-3 group"
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors",
                      onlyInStock ? "bg-black border-black" : "bg-white border-gray-200 group-hover:border-gray-300"
                    )}>
                      {onlyInStock && <Check size={14} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-sm font-medium">In Stock Only</span>
                  </button>
                </div>

                {/* Reset */}
                <button 
                  onClick={() => {
                    setMinPrice(0);
                    setMaxPrice(2000);
                    setOnlyInStock(false);
                  }}
                  className="w-full py-4 border border-gray-200 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                 <button 
                   onClick={() => setIsFilterOpen(false)}
                   className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-tight"
                 >
                   View {filteredProducts.length} Results
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="aspect-[4/5] bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="py-32 text-center">
          <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest mb-4">No Items Found</h2>
          <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

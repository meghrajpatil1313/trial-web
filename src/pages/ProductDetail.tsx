import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const docSnap = await getDoc(doc(db, 'products', id));
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="pt-32 p-4 max-w-7xl mx-auto animate-pulse h-screen bg-gray-50 rounded-3xl" />;
  if (!product) return <div className="pt-32 text-center">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-24">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest mb-12 hover:opacity-60"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-square bg-gray-50 rounded-3xl overflow-hidden"
        >
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="flex flex-col gap-8"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 inline-block">
              {product.category}
            </span>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter uppercase mb-4 leading-[0.9]">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold mb-8">{formatPrice(product.price)}</p>
            <p className="text-gray-500 leading-relaxed text-lg mb-10">
              {product.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={() => addItem(product)}
                className="flex-grow bg-black text-white py-5 rounded-full font-bold uppercase tracking-tight flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors"
              >
                <ShoppingBag size={20} />
                Add to Bag
              </button>
              <button className="flex-grow border border-gray-200 py-5 rounded-full font-bold uppercase tracking-tight hover:bg-gray-50 transition-colors">
                Buy Now
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-gray-100">
              <div className="flex flex-col gap-3">
                <Truck size={20} className="text-gray-400" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1">Free Delivery</h4>
                  <p className="text-xs text-gray-500">Rapid international shipping.</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <RefreshCw size={20} className="text-gray-400" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1">30-Day Returns</h4>
                  <p className="text-xs text-gray-500">Hassle-free exchange policy.</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <ShieldCheck size={20} className="text-gray-400" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1">Genuine Gear</h4>
                  <p className="text-xs text-gray-500">100% manufacturer warranty.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

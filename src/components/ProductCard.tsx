import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all hover:border-gray-200 hover:shadow-xl hover:shadow-black/5"
    >
      <Link to={`/product/${product.id}`} className="aspect-[4/5] overflow-hidden bg-gray-50">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition-colors"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {product.category}
          </span>
          <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
        </div>
        <Link to={`/product/${product.id}`} className="flex-grow">
          <h3 className="text-base font-medium text-gray-900 group-hover:text-black transition-colors mb-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>
        <Link 
          to={`/product/${product.id}`}
          className="flex items-center gap-1 text-xs font-bold uppercase tracking-tight group/link"
        >
          View Details
          <ChevronRight size={14} className="transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  );
};

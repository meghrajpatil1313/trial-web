import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Plus, Package, Image as ImageIcon, Tag, Hash, DollarSign, List, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const Admin = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'tech',
    imageUrl: '',
    stock: '',
    featured: false,
  });

  if (authLoading) return <div className="pt-32 text-center animate-pulse">Verifying permissions...</div>;
  
  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-48 pb-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight uppercase mb-4">Access Denied</h1>
        <p className="text-gray-500 mb-8">This page is reserved for administrators and shopkeepers.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'products'), productData);
      setSuccess(true);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'tech',
        imageUrl: '',
        stock: '',
        featured: false,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tighter uppercase">Inventory Manager</h1>
            <p className="text-gray-500 text-sm">Add a new product to your digital storefront.</p>
          </div>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white border border-gray-100 rounded-3xl p-8 shadow-2xl shadow-black/5 space-y-8"
        >
          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border border-green-100 flex items-center gap-2">
              <Sparkles size={18} />
              Product added successfully!
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2 px-1">Product Name</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Tag size={18} />
                  </div>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Velox Ultra Watch"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 border-transparent border focus:border-black focus:bg-white rounded-2xl pl-12 pr-4 py-4 transition-all focus:outline-none placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2 px-1">Description</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Tell your customers about the product features, materials, and benefits..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-50 border-transparent border focus:border-black focus:bg-white rounded-2xl px-4 py-4 transition-all focus:outline-none placeholder:text-gray-300 resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2 px-1">Price (USD)</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <DollarSign size={18} />
                  </div>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-gray-50 border-transparent border focus:border-black focus:bg-white rounded-2xl pl-12 pr-4 py-4 transition-all focus:outline-none placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2 px-1">Inventory Stock</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Hash size={18} />
                  </div>
                  <input 
                    required
                    type="number" 
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-gray-50 border-transparent border focus:border-black focus:bg-white rounded-2xl pl-12 pr-4 py-4 transition-all focus:outline-none placeholder:text-gray-300"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2 px-1">Category</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <List size={18} />
                  </div>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 border-transparent border focus:border-black focus:bg-white rounded-2xl pl-12 pr-4 py-4 transition-all focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="tech">Tech</option>
                    <option value="accessories">Accessories</option>
                    <option value="apparel">Apparel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2 px-1">Featured Product</label>
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                  className={cn(
                    "w-full flex items-center justify-between px-6 py-4 rounded-2xl border transition-all",
                    formData.featured ? "bg-black border-black text-white" : "bg-gray-50 border-transparent text-gray-400"
                  )}
                >
                  <span className="text-sm font-bold uppercase tracking-tight">Promote to Hero</span>
                  <Sparkles size={18} className={cn(formData.featured ? "text-yellow-400" : "text-gray-300")} />
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2 px-1">Image URL</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <ImageIcon size={18} />
                </div>
                <input 
                  required
                  type="url" 
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-gray-50 border-transparent border focus:border-black focus:bg-white rounded-2xl pl-12 pr-4 py-4 transition-all focus:outline-none placeholder:text-gray-300"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-2 px-1 italic">Prefer high-resolution 4:5 aspect ratio images from Unsplash.</p>
            </div>
          </div>

          <button 
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-black text-white py-5 rounded-full font-bold uppercase tracking-tight flex items-center justify-center gap-3 hover:bg-gray-900 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Plus size={20} />
                Add Product to Catalog
              </>
            )}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

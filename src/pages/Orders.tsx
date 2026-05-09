import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { formatPrice } from '../lib/utils';
import { Package, ChevronRight, Clock, CheckCircle2, Truck, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const StatusIcon = ({ status }: { status: Order['status'] }) => {
  switch (status) {
    case 'pending': return <Clock size={16} className="text-amber-500" />;
    case 'processing': return <AlertCircle size={16} className="text-blue-500" />;
    case 'shipped': return <Truck size={16} className="text-indigo-500" />;
    case 'delivered': return <CheckCircle2 size={16} className="text-green-500" />;
    case 'cancelled': return <XCircle size={16} className="text-red-500" />;
    default: return <Clock size={16} className="text-gray-500" />;
  }
};

export const Orders = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoading(true);
      const ordersPath = 'orders';
      try {
        const q = query(
          collection(db, ordersPath),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      } catch (error) {
        // If query fails (maybe index missing), fallback to simple query without sort
        try {
           const q2 = query(collection(db, ordersPath), where('userId', '==', user.uid));
           const snapshot = await getDocs(q2);
           const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
           setOrders(results.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (innerError) {
           handleFirestoreError(innerError, OperationType.LIST, ordersPath);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchOrders();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <div className="max-w-7xl mx-auto px-4 pt-48 pb-24 text-center animate-pulse">Loading your orders...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-48 pb-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight uppercase mb-4">Please sign in</h1>
        <p className="text-gray-500 mb-8">You need to be logged in to view your order history.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-10 py-4 bg-black text-white rounded-full font-bold uppercase tracking-tight hover:bg-gray-900">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-bold tracking-tighter uppercase mb-2">Order History</h1>
          <p className="text-gray-500">Track and manage your past purchases.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="py-24 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 border border-gray-100">
             <Package size={32} />
           </div>
           <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">No orders yet</h2>
           <p className="text-gray-500 mb-8 max-w-sm mx-auto">You haven't placed any orders with us. When you do, they'll show up here.</p>
           <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full font-bold uppercase tracking-tight hover:bg-gray-900 transition-colors">
             Shop Collection
           </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              key={order.id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-all hover:shadow-lg hover:shadow-black/5"
            >
              <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Order #{order.id.slice(-6).toUpperCase()}</span>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full">
                      <StatusIcon status={order.status} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{order.status}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-8">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Date</p>
                      <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Total</p>
                      <p className="text-sm font-bold">{formatPrice(order.total)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Items</p>
                      <p className="text-sm font-medium">{order.items.reduce((acc, curr) => acc + curr.quantity, 0)} items</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-end justify-between gap-4">
                   <div className="flex -space-x-4">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-100 ring-1 ring-gray-100">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-900 flex items-center justify-center text-white text-[10px] font-bold ring-1 ring-gray-100">
                          +{order.items.length - 3}
                        </div>
                      )}
                   </div>
                   <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-gray-500 transition-colors">
                     View Details <ChevronRight size={14} />
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

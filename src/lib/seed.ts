import { collection, doc, getDocs, setDoc, query, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

const MOCK_PRODUCTS = [
  // ... (keeping MOCK_PRODUCTS as defined before)
  {
    id: 'p1',
    name: 'Velox Horizon Watch',
    description: 'A minimalist masterpiece. Brushed stainless steel casing with a charcoal genuine leather strap. Precision movement and sapphire glass.',
    price: 249.00,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000',
    stock: 15,
    featured: true
  },
  {
    id: 'p2',
    name: 'Acoustic S1 Headphones',
    description: 'Immersive sound, redefined. Active noise cancellation and 40-hour battery life. Premium memory foam ear cushions for all-day comfort.',
    price: 349.00,
    category: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000',
    stock: 20,
    featured: true
  },
  {
    id: 'p3',
    name: 'Monolith Speaker Duo',
    description: 'High-fidelity audio in a monolithic form factor. Walnut wood finish with aluminum accents. Wireless connectivity and multi-room sync.',
    price: 599.00,
    category: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&q=80&w=1000',
    stock: 10,
    featured: true
  },
  {
    id: 'p4',
    name: 'Element Card Holder',
    description: 'Ultra-slim profile, maximum protection. RFID blocking aerospace-grade aluminum. Holds up to 6 cards and cash.',
    price: 65.00,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=1000',
    stock: 50,
    featured: true
  },
  {
    id: 'p5',
    name: 'Nexus Charging Pad',
    description: 'Fast wireless charging for all your devices. Minimalist aesthetic with a fabric-textured surface and weighted base.',
    price: 89.00,
    category: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1615526675159-e248c3117d37?auto=format&fit=crop&q=80&w=1000',
    stock: 35,
    featured: false
  },
  {
    id: 'p6',
    name: 'Zenith Peak Sunglasses',
    description: 'Polarized lenses with a sleek matte frame. Designed for clarity and style in any lighting condition.',
    price: 120.00,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=1000',
    stock: 25,
    featured: false
  }
];

export const seedMockData = async () => {
  try {
    const q = query(collection(db, 'products'), limit(1));
    const snap = await getDocs(q);
    
    if (snap.empty) {
      console.log('Database empty, seeding mock products...');
      for (const p of MOCK_PRODUCTS) {
        try {
          await setDoc(doc(db, 'products', p.id), p);
        } catch (e) {
          // If seeding fails (e.g. not admin), we just log and continue
          // This prevents the whole app from crashing if the user isn't logged in as admin yet
          console.warn(`Failed to seed product ${p.id}: ${e instanceof Error ? e.message : String(e)}`);
        }
      }
    }
  } catch (error) {
    // We don't use handleFirestoreError here for the check because it might be non-critical
    console.error('Error during database check for seeding:', error);
  }
};

import { collection, doc, getDocs, setDoc, query, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

const MOCK_PRODUCTS = [
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
  },
  {
    id: 'p7',
    name: 'Cyber Mechanical Keyboard',
    description: 'Hot-swappable tactile switches with RGB per-key lighting. Solid aluminum plate and PBT keycaps for a premium typing experience.',
    price: 189.00,
    category: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=1000',
    stock: 12,
    featured: true
  },
  {
    id: 'p8',
    name: 'Tactile Wireless Mouse',
    description: 'Ergonomic design with an 18,000 DPI optical sensor. Dual-mode wireless and 7 programmable buttons.',
    price: 95.00,
    category: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000',
    stock: 40,
    featured: false
  },
  {
    id: 'p9',
    name: 'Onyx Laptop Sleeve',
    description: 'Water-resistant vegan leather with a soft microfiber lining. Slim fit for 14" and 16" laptops.',
    price: 75.00,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=1000',
    stock: 30,
    featured: false
  },
  {
    id: 'p10',
    name: 'Grid Desk Mat',
    description: 'Premium linoleum surface with a natural cork base. Provides a smooth gliding surface and protects your desk.',
    price: 45.00,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1589987598188-f7b587a382e2?auto=format&fit=crop&q=80&w=1000',
    stock: 60,
    featured: false
  },
  {
    id: 'p11',
    name: 'Vertex 1TB External SSD',
    description: 'Ulta-fast transfer speeds up to 1050MB/s. Pocket-sized, durable aluminum casing, and cross-platform compatibility.',
    price: 129.00,
    category: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1544099858-75feeb57f0ce?auto=format&fit=crop&q=80&w=1000',
    stock: 22,
    featured: true
  },
  {
    id: 'p12',
    name: 'Lumina Smart Bulb Pack',
    description: 'Set of 4 WiFi-enabled RGB bulbs. Voice control compatible and customizable lighting scenes for every mood.',
    price: 59.00,
    category: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&q=80&w=1000',
    stock: 45,
    featured: false
  },
  {
    id: 'p13',
    name: 'Titanium Multi-tool',
    description: '15 functions in one pocket-sized tool. Grade 5 titanium construction for extreme durability and lightness.',
    price: 110.00,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1590233464442-553fd31f7123?auto=format&fit=crop&q=80&w=1000',
    stock: 18,
    featured: false
  },
  {
    id: 'p14',
    name: 'Flux Wireless Earbuds',
    description: 'The ultimate fitness companion. Stay-aware mode, IPX7 waterproofing, and secure-fit wings.',
    price: 159.00,
    category: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=1000',
    stock: 28,
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
          console.warn(`Failed to seed product ${p.id}: ${e instanceof Error ? e.message : String(e)}`);
        }
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error during database check for seeding:', error);
    return false;
  }
};

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  sizes: string[];
  price: number;
  image: string;
  query: string;
}

export interface PriceEntry {
  platform: string;
  price: number;
  url: string;
  inStock: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Tactical Cargo Pants',
    brand: 'ACRONYM',
    category: 'Bottoms',
    sizes: ['S', 'M', 'L', 'XL'],
    price: 189,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=533&fit=crop',
    query: 'tactical cargo pants techwear',
  },
  {
    id: '2',
    name: 'Stealth Shell Jacket',
    brand: 'NIKELAB',
    category: 'Outerwear',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    price: 245,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=533&fit=crop',
    query: 'stealth shell jacket',
  },
  {
    id: '3',
    name: 'Compression Base Layer',
    brand: 'UNDER ARMOUR',
    category: 'Tops',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    price: 64,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=533&fit=crop',
    query: 'compression base layer top',
  },
  {
    id: '4',
    name: 'Utility Vest MK-II',
    brand: 'STONE ISLAND',
    category: 'Outerwear',
    sizes: ['M', 'L', 'XL'],
    price: 310,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=533&fit=crop',
    query: 'utility vest technical',
  },
  {
    id: '5',
    name: 'Phantom Hoodie',
    brand: 'FOG ESSENTIALS',
    category: 'Tops',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    price: 120,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=533&fit=crop',
    query: 'phantom hoodie streetwear',
  },
  {
    id: '6',
    name: 'Aero Track Pants',
    brand: 'ADIDAS Y-3',
    category: 'Bottoms',
    sizes: ['S', 'M', 'L', 'XL'],
    price: 175,
    image: 'https://images.unsplash.com/photo-1580906853305-6c63c5d2082e?w=400&h=533&fit=crop',
    query: 'aero track pants y3',
  },
  {
    id: '7',
    name: 'Modular Harness Bag',
    brand: 'ACRONYM',
    category: 'Accessories',
    sizes: ['OS'],
    price: 420,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=533&fit=crop',
    query: 'modular harness bag techwear',
  },
  {
    id: '8',
    name: 'Carbon Fiber Tee',
    brand: 'CP COMPANY',
    category: 'Tops',
    sizes: ['S', 'M', 'L', 'XL'],
    price: 95,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=533&fit=crop',
    query: 'carbon fiber graphic tee',
  },
];

export function getProductPrices(productId: string): PriceEntry[] {
  // Mock price comparison data
  const basePrice = PRODUCTS.find((p) => p.id === productId)?.price || 100;
  const variance = () => Math.round(basePrice * (0.85 + Math.random() * 0.35));

  return [
    { platform: 'Amazon', price: variance(), url: '#', inStock: true },
    { platform: 'Flipkart', price: variance(), url: '#', inStock: true },
    { platform: 'Myntra', price: variance(), url: '#', inStock: Math.random() > 0.2 },
    { platform: 'Ajio', price: variance(), url: '#', inStock: Math.random() > 0.3 },
    { platform: 'Meesho', price: variance(), url: '#', inStock: Math.random() > 0.4 },
  ].sort((a, b) => a.price - b.price);
}

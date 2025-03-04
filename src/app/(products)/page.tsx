// filepath: src/app/(products)/page.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../../components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get<{ id: number; name: string; price: number }[]>('/api/products');
      setProducts(response.data);
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
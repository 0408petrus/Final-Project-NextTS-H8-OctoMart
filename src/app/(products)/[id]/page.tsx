// filepath: src/app/(products)/[id]/page.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<{ image: string; title: string; description: string; price: number } | null>(null);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const response = await axios.get<{ image: string; title: string; description: string; price: number }>(`/api/products/${id}`);
        setProduct(response.data);
      };

      fetchProduct();
    }
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <img src={product.image} alt={product.title} />
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>{product.price}</p>
      <button>Add to Cart</button>
    </div>
  );
}
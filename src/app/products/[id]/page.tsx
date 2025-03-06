"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { IProduct } from "@/app/definitions/products";
import Loading from "@/app/(main)/loading";
import RootLayout from "@/app/(main)/layout";

export default function ProductDetailPage() {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      async function fetchProduct() {
        try {
          const res = await fetch(`/api/products/${id}`);
          if (!res.ok) {
            throw new Error('Failed to fetch product');
          }
          const product: IProduct = await res.json();
          setProduct(product);
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      }
      fetchProduct();
    }
  }, [id]);

  const handleIncrement = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrement = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleAddToCart = async () => {
    try {
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCartItems = [...cartItems, { ...product, quantity }];
      localStorage.setItem('cart', JSON.stringify(updatedCartItems));

      // Update the stock count in the database
      await fetch(`/api/products/${product?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: { count: product!.rating.count - quantity } }),
      });

      alert('Product added to cart');
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  if (!product) {
    return <Loading />;
  }

  return (
    <RootLayout>
      <div className="container mx-auto p-4">
        <button
          onClick={() => router.push('/')}
          className="mb-4 px-4 py-2 bg-red-800 text-white rounded hover:bg-slate-800 ease-in-out transition duration-300"
        >
          Back to Home
        </button>
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <img src={product.image} alt={product.title} className="w-full md:w-1/2 h-96 object-cover rounded-lg mb-4 md:mb-0 md:mr-4" />
          <div className="p-4 bg-white shadow-md rounded-lg w-full md:w-1/2">
            <p className="mb-2 text-2xl font-bold">{product.title}</p>
            <p className="mb-2"><strong>Stock:</strong> {product.rating.count}</p>
            <p className="mb-2"><strong>$ </strong> {product.price}</p>
            <p className="mb-2">{product.description}</p>
            <p className="mb-2"> {product.category}</p>
            <p className="mb-2">Atur Jumlah</p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrement}
                className="bg-gray-300 text-gray-700 px-2 py-1 rounded"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={handleIncrement}
                className="bg-gray-300 text-gray-700 px-2 py-1 rounded"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="mt-4 px-4 py-2 bg-red-800 text-white rounded"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}

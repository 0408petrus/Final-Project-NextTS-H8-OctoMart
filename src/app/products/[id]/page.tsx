"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { IProduct } from "@/app/definitions/products";
import Loading from "@/app/(main)/loading";
import RootLayout from "@/app/(main)/layout";

export default function ProductDetailPage() {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isInCart, setIsInCart] = useState<boolean>(false);
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

  useEffect(() => {
    if (id) {
      async function checkCart() {
        try {
          const res = await fetch(`/api/cart/${id}`);
          if (!res.ok) {
            throw new Error('Failed to check cart');
          }
          const result = await res.json();
          setIsInCart(result.isInCart);
        } catch (error) {
          console.error('Error checking cart:', error);
        }
      }
      checkCart();
    }
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const res = await fetch(`/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: id }),
      });
      if (!res.ok) {
        throw new Error('Failed to add to cart');
      }
      setIsInCart(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
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
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
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
            <button
              onClick={handleAddToCart}
              className={`mt-4 px-4 py-2 rounded ${isInCart ? 'bg-gray-500' : 'bg-blue-500'} text-white`}
              disabled={isInCart}
            >
              {isInCart ? 'Already in Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}

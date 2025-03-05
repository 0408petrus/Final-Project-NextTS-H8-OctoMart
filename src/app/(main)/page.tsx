"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IProduct } from "@/app/definitions/products";
import Loading from "./loading";

export default function Home() {
  const [products, setProduct] = useState<IProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products?search=${searchQuery}`);
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const products: IProduct[] = await res.json();
        setProduct(products);
        console.log('Product fetched:', products);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [searchQuery]);

  const handleViewDetails = (id: number) => {
    router.push(`/products/${id}`);
  };

  const handleSearch = () => {
    setSearchQuery(inputValue);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Product List</h1>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border p-2 rounded-l-lg"
          placeholder="Search for product..."
        />
        <button
          onClick={handleSearch}
          className="bg-red-800 text-white px-4 py-2 rounded-r-lg"
        >
          Search
        </button>
      </div>
      <div className="flex gap-4 flex-wrap justify-center">
        {products.map(product => (
            <div key={product.id} className="border p-4 my-2 w-[300px] rounded-lg shadow-lg">
            <div className="w-full h-48 relative">
              <img src={product.image} alt={product.title} className="w-full h-full object-contain rounded-t-lg" />
            </div>
            <div className="p-2">
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <h2 className="text-red-600 text-xl">${product.price}</h2>
              <p className="text-gray-600">{product.category}</p>
              <div className="flex items-center">
              <img src="/star-rate.svg" alt="Rating" className="w-4 h-4 mr-1" />
              <p className="text-gray-600">{product.rating.rate} | {product.rating.count} terjual</p>
              </div>
            </div>
            <div>
              <button
              onClick={() => handleViewDetails(product.id)}
              className="bg-red-800 text-white px-4 py-2 rounded-lg mt-2"
              >
              View Details
              </button>
              {/* <button
              onClick={() => handleViewDetails(product.id)}
              className="bg-red-800 text-white px-4 py-2 rounded-lg mt-2"
              >
              Add to Cart
              </button> */}
            </div>
            </div>
        ))}
      </div>
    </div>
  );
}

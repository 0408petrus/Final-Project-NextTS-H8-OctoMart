"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IProduct } from "@/app/definitions/products";
import RootLayout from "@/app/(main)/layout";
import Loading from "@/app/(main)/loading";

interface CartItem extends IProduct {
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cartItems);
    setIsLoading(false);
  }, []);

  const handleIncrement = (id: number) => {
    const updatedCartItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  const handleDecrement = (id: number) => {
    const updatedCartItems = cartItems
      .map(item =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter(item => item.quantity > 0); // Remove items with quantity 0
    setCartItems(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  // Gabungkan item yang sama di keranjang belanjaan
  const addToCart = (newItem: CartItem) => {
    const existingItem = cartItems.find(item => item.id === newItem.id);
    let updatedCartItems;
    if (existingItem) {
      updatedCartItems = cartItems.map(item =>
        item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item
      );
    } else {
      updatedCartItems = [...cartItems, newItem];
    }
    setCartItems(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  const handleBuy = async () => {
    try {
      const res = await fetch(`/api/cart/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }),
      });
      if (!res.ok) {
        throw new Error('Failed to buy items');
      }

      // Update the product stock count
      for (const item of cartItems) {
        await fetch(`/api/products/${item.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rating: { count: item.rating.count - item.quantity } }),
        });
      }

      localStorage.removeItem('cart');
      setCartItems([]);
      router.push('/');
    } catch (error) {
      console.error('Error buying items:', error);
    }
  };

  const totalCost = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <RootLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">Cart</h1>
        {cartItems.length === 0 ? (
          <p className="text-center">Your cart is empty</p>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="border p-4 rounded-lg shadow-lg flex items-center">
                  <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-lg mr-4" />
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">{item.title}</h2>
                    <p className="text-gray-600">{item.category}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">Total: ${item.price * item.quantity}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleDecrement(item.id)}
                        className="bg-gray-300 text-gray-700 px-2 py-1 rounded"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleIncrement(item.id)}
                        className="bg-gray-300 text-gray-700 px-2 py-1 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-white shadow-md rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-center">Shopping Summary</h2>
              <p className="text-xl text-center">Total Cost: ${totalCost.toFixed(2)}</p>
              <button
                onClick={handleBuy}
                className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Buy
              </button>
            </div>
          </>
        )}
      </div>
    </RootLayout>
  );
}
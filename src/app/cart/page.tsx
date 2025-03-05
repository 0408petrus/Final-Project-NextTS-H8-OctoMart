// filepath: src/app/cart/page.tsx
"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CartPage() {
  interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
  }

  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]') || [];
    setCart(cartItems);
  }, []);

  const handleQuantityChange = (id: number, quantity: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleCheckout = async () => {
    try {
      await axios.post('/api/checkout', { cart });
      localStorage.removeItem('cart');
      setCart([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {cart.map((item) => (
        <div key={item.id}>
          <h2>{item.title}</h2>
          <p>{item.price}</p>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
          />
        </div>
      ))}
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
}
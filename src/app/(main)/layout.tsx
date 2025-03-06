"use client"

import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import { useState, useEffect } from "react";
import React from "react";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("Guest");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const router = useRouter();

  const handleCart = () => {
    router.push(`/cart`);
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/user');
        if (!res.ok) {
          throw new Error('Failed to fetch user');
        }
        const user = await res.json();
        setUserName(user.email); // Display the user's email
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    console.log('RootLayout searchQuery:', searchQuery);
  }, [searchQuery]);

  return (
    <>
      <header className="bg-gradient-to-r from-slate-800 via-red-500 to-[#790008] text-white p-4 flex gap-4 items-center shadow-lg">
        <img src="/octo_merchant.png" alt="OCTO Mart" className="w-12 h-12" />
        <Link className="text-2xl" href="/"><span className="font-bold">OCTO</span> Mart</Link>
        <div className="ml-auto flex items-center gap-4">
          <span>Welcome, {userName}</span>
          <button onClick={handleCart} className="flex items-center gap-2 p-2 text-white rounded hover:bg-red-600 transition duration-300 ease-in-out">
            <img src="/cart.svg" alt="Cart" className="bg-white w-10 h-10 rounded-full shadow-lg" />
          </button>
        </div>
        <LogoutButton />
      </header>
      <main>{children}</main>
    </>
  );
}
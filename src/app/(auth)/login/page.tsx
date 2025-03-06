"use client";

import { login } from "@/app/actions/auth";
import Link from "next/link";
import { useActionState } from "react";

export default function Login() {
  const [state, formAction, pending] = useActionState(login, { message: "" });

  return (
    <form action={formAction} className="p-8 bg-white w-[320px] rounded-lg shadow-lg flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-center text-red-800">Login</h1>

      {state.message && (
        <div className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded">{state.message}</div>
      )}

      <div>
        <label htmlFor="email" className="block mb-2 text-black">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="block mb-2 text-black">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <button
          disabled={pending}
          className="w-full bg-red-800 text-white rounded-md p-2 mt-4"
        >
          Login
        </button>
      </div>

      <div className="text-center">
        Do not have account?{" "}
        <Link href="/register" className="text-red-800">
          Register
        </Link>
      </div>
    </form>
  );
}
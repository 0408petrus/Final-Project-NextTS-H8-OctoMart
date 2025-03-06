'use client'
import { register } from "@/app/actions/auth";
import Link from "next/link";
import { useActionState, useState } from "react";

const initialState = {
  errors: {
    email: [],
    password: [],
  }
}

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [state, formAction, pending] = useActionState(register, initialState);

  return (
    <>
      <form
        action={formAction}
        className="p-8 bg-white w-[320px] rounded-lg shadow-lg flex flex-col gap-8"
      >
        <h1 className="text-3xl font-bold text-center text-red-800">Register</h1>

        <div>
          <label htmlFor="email" className="block mb-2 text-black">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            name="email"
            className="w-full border border-gray-300 rounded-md p-2"
          />
          {<div className="text-red-500 text-sm mt-2">{state.errors.email?.join(", ")}</div>}
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 text-black">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            name="password"
            className="w-full border border-gray-300 rounded-md p-2"
          />
          {<div className="text-red-500 text-sm mt-2">{state.errors.password?.join(", ")}</div>}
        </div>

        <div>
          <button disabled={pending} className="w-full bg-red-800 text-white rounded-md p-2 mt-4">
            {pending ? "Saving data..." : "Register"}
          </button>
        </div>

        <div className="text-center">
          Have account already? <Link href="/login" className="text-red-800">Login</Link>
        </div>
      </form>
    </>
  );
}
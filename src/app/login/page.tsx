"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Backend ko Login request bhejo
      // Hum "email" field mein username ya email dono bhej sakte hain backend logic ke hisab se
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      // 2. Kamyabi! 
      // User ka data LocalStorage mein save kar lo (taake Navbar par photo dikha sakein)
      localStorage.setItem("user", JSON.stringify(result.data.user));
      localStorage.setItem("accessToken", result.data.accessToken);

      alert("Login Successful! Welcome back. 👋");
      
      // 3. Home Page par wapis jao
      router.push("/");
      
      // Page ko refresh karo taake Navbar update ho jaye
      setTimeout(() => {
        window.location.reload();
      }, 500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black p-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800">
        
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Welcome Back 👋
        </h2>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email or Username */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 text-sm mb-1">Email or Username</label>
            <input
              type="text"
              name="email" // Backend check karega email ya username
              placeholder="john@example.com"
              className="w-full p-3 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full p-3 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition duration-300 disabled:bg-gray-500"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-500 text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
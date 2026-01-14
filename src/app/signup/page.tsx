"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  
  // Form ka data store karne ke liye
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });
  
  // Files ke liye alag state
  const [avatar, setAvatar] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Jab user likhna shuru kare
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form submit karne par
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. FormData banana (Kyunke files upload karni hain)
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("username", formData.username);
    data.append("password", formData.password);
    
    if (avatar) {
      data.append("avatar", avatar);
    } else {
      setError("Avatar is required!");
      setLoading(false);
      return;
    }

    if (coverImage) {
      data.append("coverImage", coverImage);
    }

    try {
      // 2. Backend ko data bhejna
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
        method: "POST",
        body: data, // JSON nahi, FormData bhej rahe hain
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Signup failed");
      }

      // 3. Kamyabi! Login page par bhejo
      alert("Account created successfully! 🎉");
      router.push("/login"); // Hum abhi Login page banayenge

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
          Create Account 🚀
        </h2>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 text-sm mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="John Doe"
              className="w-full p-3 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              className="w-full p-3 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 text-sm mb-1">Username</label>
            <input
              type="text"
              name="username"
              placeholder="johndoe123"
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

          {/* Avatar (Required) */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 text-sm mb-1">
              Avatar (Profile Picture) <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full text-gray-400 text-sm"
              onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              required
            />
          </div>

          {/* Cover Image (Optional) */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 text-sm mb-1">
              Cover Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full text-gray-400 text-sm"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition duration-300 disabled:bg-gray-500"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
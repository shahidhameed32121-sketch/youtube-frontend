"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 State for Search

  // Check karo ke user login hai ya nahi
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
    alert("Logged out successfully");
    router.push("/login");
  };

  // 🔍 Search Function
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Page refresh mat hone do
    if (searchQuery.trim()) {
      router.push(`/search?query=${searchQuery}`); // Search page par bhej do
    }
  };

  // Avatar Image ka URL theek karna
  const getAvatarUrl = (path: string) => {
    if (!path) return "/default-avatar.png";
    if (path.startsWith("http")) return path;
    if (path.includes("public")) {
      const cleanPath = path.replace(/\\/g, "/");
      return `http://localhost:8000/${cleanPath}`;
    }
    return path;
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <div className="text-red-600">
            <svg height="30" viewBox="0 0 24 24" width="30" focusable="false">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="currentColor"></path>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tighter dark:text-white">YouTube <span className="text-xs font-normal text-gray-500">Clone</span></span>
        </Link>

        {/* 🔍 Search Bar (Ab Functional Hai) */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-6">
           <input 
             type="text" 
             placeholder="Search" 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-full px-4 py-2 focus:outline-none focus:border-blue-500 dark:text-white" 
           />
           <button type="submit" className="bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-300 dark:border-gray-700 rounded-r-full px-5 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
             🔍
           </button>
        </form>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          
          <Link href="/upload" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full" title="Upload Video">
            📹 <span className="sr-only">Upload</span>
          </Link>

          {user ? (
            // Agar User Login Hai -> Avatar Dikhao
            <div className="flex items-center gap-3">
              
              {/* 📊 Dashboard Link (New) */}
              <Link href="/dashboard" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full" title="Dashboard">
                 📊
              </Link>

              <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                <img 
                  src={getAvatarUrl(user.avatar)} 
                  alt="User Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="hidden sm:block font-medium text-sm dark:text-white">
                {user.username}
              </span>
              <button 
                onClick={handleLogout}
                className="text-xs text-red-500 hover:text-red-700 font-bold border border-red-200 px-2 py-1 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            // Agar User Login NAHI Hai -> Sign In Button Dikhao
            <Link href="/login">
              <button className="flex items-center gap-2 text-blue-600 border border-blue-600 px-4 py-1.5 rounded-full font-medium text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30">
                👤 Sign In
              </button>
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}
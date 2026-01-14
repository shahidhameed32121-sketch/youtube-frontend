"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LikeButton({ videoId }: { videoId: string }) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Please login to like this video! 👍");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/likes/toggle/v/${videoId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        setIsLiked((prev) => !prev); // State palat do
        const data = await response.json();
        // Console mein check kar sakte hain message
        console.log(data.message); 
      } else {
        alert("Failed to like video");
      }

    } catch (error) {
      console.error(error);
      alert("Error liking video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all border ${
        isLiked
          ? "bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
      }`}
    >
      {/* Thumbs Up Icon */}
      {isLiked ? "👍 Liked" : "👍 Like"}
    </button>
  );
}
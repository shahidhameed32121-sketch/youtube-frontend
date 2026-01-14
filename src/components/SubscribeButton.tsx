"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubscribeButton({ channelId }: { channelId: string }) {
  const router = useRouter();
  const [isSubscribed, setIsSubscribed] = useState(false); // Abhi ke liye false rakhte hain
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    // 1. Check karo Login hai ya nahi
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Please login to subscribe! 🔒");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      // 2. Backend ko request bhejo
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/c/${channelId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        // 3. Status palat do (Agar Subscribe tha to Unsubscribe, aur vice versa)
        setIsSubscribed((prev) => !prev);
        const data = await response.json();
        alert(data.message); // "Subscribed" ya "Unsubscribed" ka message aayega
      } else {
        alert("Something went wrong");
      }

    } catch (error) {
      console.error(error);
      alert("Error subscribing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
        isSubscribed
          ? "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white" // Subscribed Style
          : "bg-red-600 text-white hover:bg-red-700" // Not Subscribed Style (Red)
      }`}
    >
      {loading ? "..." : isSubscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
}
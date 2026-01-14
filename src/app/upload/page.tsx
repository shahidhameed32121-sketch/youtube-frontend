"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Upload() {
  const router = useRouter();
  
  // Token check (Agar login nahi, to Login page par bhej do)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Please login to upload videos! 🔒");
      router.push("/login");
    }
  }, []);

  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    // Token nikalo
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("You are not logged in!");
        router.push("/login");
        return;
    }

    const formData = new FormData();
    if (file) formData.append("videoFile", file);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`, {
        method: "POST",
        headers: {
            // 👇 Yahan hum apna Token dikha rahe hain
            Authorization: `Bearer ${token}` 
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      alert("Video Uploaded Successfully! 🎉");
      router.push("/");
      
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black p-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Upload New Video 📹</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Video Title" 
            className="w-full p-3 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white outline-none"
            onChange={(e) => setTitle(e.target.value)} 
          />
          
          <textarea 
            placeholder="Description" 
            className="w-full p-3 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white outline-none"
            onChange={(e) => setDescription(e.target.value)}
          />

          <div>
            <label className="text-sm text-gray-500">Video File</label>
            <input 
              type="file" 
              accept="video/*" 
              className="w-full mt-1 text-gray-400"
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Thumbnail Image</label>
            <input 
              type="file" 
              accept="image/*" 
              className="w-full mt-1 text-gray-400"
              onChange={(e) => setThumbnail(e.target.files?.[0] || null)} 
            />
          </div>

          <button 
            type="submit" 
            disabled={uploading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded transition"
          >
            {uploading ? "Uploading..." : "Publish Video"}
          </button>
        </form>
      </div>
    </div>
  );
}
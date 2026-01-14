"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    try {
      // Backend se data mangwao
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`);
      const data = await res.json();
      
      if (data.success) {
        // 👇 FIX: Backend ab 'docs' mein array bhejta hai, is liye hum check laga rahe hain
        // Agar 'docs' mile to wo uthao, warna direct data (safetly ke liye)
        setVideos(data.data.docs || data.data); 
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-white">Loading videos... ⏳</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          All Videos 🎥
        </h1>

        {videos.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No videos uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* 👇 Yahan ab .map() sahi chalega kyunke humne array fix kar diya hai */}
            {videos.map((video) => (
              <Link key={video._id} href={`/video/${video._id}`}>
                <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer group">
                  
                  {/* Thumbnail Section */}
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    <img
                      src={
                        video.thumbnail?.includes("http")
                          ? video.thumbnail
                          : `http://localhost:8000/${video.thumbnail?.replace(/\\/g, "/")}`
                      }
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                  </div>

                  {/* Info Section */}
                  <div className="p-4">
                    <div className="flex gap-3 items-start">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                        <img
                          src={
                            video.owner?.avatar?.includes("http")
                              ? video.owner.avatar
                              : `http://localhost:8000/${video.owner?.avatar?.replace(/\\/g, "/")}`
                          }
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Text Info */}
                      <div>
                        <h3 className="font-bold text-sm text-gray-800 dark:text-white line-clamp-2 leading-tight">
                          {video.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 hover:text-gray-700 dark:hover:text-gray-300">
                          {video.owner?.username}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(video.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query"); // URL se lafz uthao (e.g. ?query=funny)
  
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        // Backend ko bolo: "Is lafz wali videos do"
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos?query=${query}`);
        const data = await res.json();
        if (data.success) {
            // Note: Backend pagination deta hai (docs array ke andar videos hoti hain)
            setVideos(data.data.docs || data.data); 
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchVideos();
    }
  }, [query]);

  if (loading) return <div className="text-center mt-20 text-white">Searching for "{query}"... 🔍</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black p-6 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Search Results for: <span className="text-blue-500">"{query}"</span>
        </h1>

        {videos.length === 0 ? (
          <p className="text-gray-500">No videos found matching your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Link key={video._id} href={`/video/${video._id}`}>
                <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer">
                  {/* Thumbnail */}
                  <div className="h-48 bg-gray-200 relative">
                    <img
                      src={video.thumbnail?.replace(/\\/g, "/").includes("http") 
                           ? video.thumbnail 
                           : `http://localhost:8000/${video.thumbnail?.replace(/\\/g, "/")}`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 text-gray-800 dark:text-white line-clamp-2">
                        {video.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                             <img 
                                src={video.owner?.avatar?.replace(/\\/g, "/").includes("http") 
                                     ? video.owner.avatar 
                                     : `http://localhost:8000/${video.owner?.avatar?.replace(/\\/g, "/")}`}
                                className="w-full h-full object-cover"
                             />
                        </div>
                        <p className="text-sm text-gray-500">{video.owner?.username}</p>
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
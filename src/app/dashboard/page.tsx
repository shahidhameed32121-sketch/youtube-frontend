"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    subscribers: 0,
    totalLikes: 0,
  });
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Data Fetch Karna
  const fetchDashboardData = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      // 1. Stats Lao
      const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      if(statsData.success) setStats(statsData.data);

      // 2. Videos Lao
      const videosRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/videos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const videosData = await videosRes.json();
      if(videosData.success) setVideos(videosData.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Video Delete Karna 🗑️
  const handleDelete = async (videoId: string) => {
    if(!confirm("Are you sure you want to delete this video?")) return;

    const token = localStorage.getItem("accessToken");
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/${videoId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        if(res.ok) {
            alert("Video Deleted Successfully");
            fetchDashboardData(); // List refresh karo
        } else {
            alert("Failed to delete");
        }
    } catch (error) {
        console.error(error);
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black p-6">
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Channel Dashboard 📊</h1>

        {/* 1. Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Views" value={stats.totalViews} icon="👁️" />
            <StatCard label="Subscribers" value={stats.subscribers} icon="👥" />
            <StatCard label="Total Likes" value={stats.totalLikes} icon="❤️" />
            <StatCard label="Total Videos" value={stats.totalVideos} icon="📹" />
        </div>

        {/* 2. Upload Button */}
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Your Videos</h2>
            <Link href="/upload">
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium">
                    + Upload New Video
                </button>
            </Link>
        </div>

        {/* 3. Videos Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    <tr>
                        <th className="p-4">Video</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {videos.map((video) => (
                        <tr key={video._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={video.thumbnail?.replace(/\\/g, "/").includes("http") ? video.thumbnail : `http://localhost:8000/${video.thumbnail?.replace(/\\/g, "/")}`} 
                                        className="w-16 h-10 object-cover rounded bg-gray-200"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-white line-clamp-1">{video.title}</p>
                                        <p className="text-xs text-green-500">Published</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4 text-sm text-gray-500">
                                {new Date(video.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-center">
                                <button 
                                    onClick={() => handleDelete(video._id)}
                                    className="text-red-500 hover:text-red-700 font-bold border border-red-200 p-2 rounded-lg hover:bg-red-50"
                                >
                                    🗑️ Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {videos.length === 0 && <p className="p-6 text-center text-gray-500">No videos uploaded yet.</p>}
        </div>

      </div>
    </div>
  );
}

// Chota Component Card ke liye
function StatCard({ label, value, icon }: any) {
    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex items-center gap-4">
            <div className="text-3xl bg-gray-100 dark:bg-gray-800 p-3 rounded-full">{icon}</div>
            <div>
                <p className="text-gray-500 text-sm">{label}</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
            </div>
        </div>
    );
}
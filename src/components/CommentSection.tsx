"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CommentSection({ videoId }: { videoId: string }) {
  const router = useRouter();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Comments Fetch karna (Jab page load ho)
  const fetchComments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${videoId}`);
      const data = await res.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  // 2. Naya Comment Add karna
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Please login to comment! 🔒");
      router.push("/login");
      return;
    }

    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${videoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      });

      if (res.ok) {
        setNewComment(""); // Input khali karo
        fetchComments();   // List refresh karo taake naya comment dikhe
      } else {
        alert("Failed to post comment");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Avatar URL Helper
  const getAvatarUrl = (path: string) => {
    if (!path) return "/default-avatar.png";
    if (path.startsWith("http")) return path;
    if (path.includes("public")) {
      return `http://localhost:8000/${path.replace(/\\/g, "/")}`;
    }
    return path;
  };

  return (
    <div className="mt-6 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Comments ({comments.length})
      </h3>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Posting..." : "Comment"}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-3 items-start border-b border-gray-100 dark:border-gray-800 pb-3">
            {/* User Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
              <img
                src={getAvatarUrl(comment.owner?.avatar)}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                  @{comment.owner?.username}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {comment.content}
              </p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-center text-gray-500 py-4">No comments yet. Be the first! 🚀</p>
        )}
      </div>
    </div>
  );
}
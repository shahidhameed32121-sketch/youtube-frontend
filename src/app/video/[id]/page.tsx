import SubscribeButton from "@/components/SubscribeButton";
import LikeButton from "@/components/LikeButton";
import CommentSection from "@/components/CommentSection"; // 👈 1. YEH IMPORT ADD KIYA
import React from "react";

async function getVideo(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function WatchPage(props: { params: Promise<{ id: string }> }) {
  
  const params = await props.params;
  const { id } = params;

  const data = await getVideo(id);
  const video = data?.data;

  if (!video) {
    return <div className="text-center mt-20 text-white">Video not found 😕</div>;
  }

  // 1. Video URL Fix
  let videoSrc = video.videoFile;
  if (video.videoFile.includes("public")) {
    const cleanPath = video.videoFile.replace(/\\/g, "/");
    videoSrc = `http://localhost:8000/${cleanPath}`;
  }

  // 2. Avatar URL Fix
  let avatarSrc = video.owner?.avatar || "/default-avatar.png"; 
  if (avatarSrc.includes("public")) {
     avatarSrc = `http://localhost:8000/${avatarSrc.replace(/\\/g, "/")}`;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Video Player */}
        <div className="bg-black rounded-xl overflow-hidden shadow-2xl aspect-video relative">
          <video 
            src={videoSrc} 
            controls 
            autoPlay 
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Title */}
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{video.title}</h1>
        </div>

        {/* Channel Info & Buttons Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm gap-4">
            
            {/* Left Side: Avatar & Name */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300">
                    <img 
                      src={avatarSrc} 
                      alt="Channel Avatar" 
                      className="w-full h-full object-cover" 
                    />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-lg">
                        {video.owner?.username || "Unknown Channel"}
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Joined: {video.createdAt?.split("T")[0]} 
                    </p>
                </div>
            </div>

            {/* Right Side: Subscribe & Like Buttons */}
            <div className="flex items-center gap-3">
                <SubscribeButton channelId={video.owner?._id} /> 
                <LikeButton videoId={video._id} />
            </div>

        </div>

        {/* Description Section */}
        <div className="mt-4 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-300 text-sm whitespace-pre-wrap">
             <span className="font-bold block mb-2 text-black dark:text-white">Description:</span>
             {video.description}
        </div>

        {/* 👇 2. COMMENTS SECTION YAHAN LAGAYA HAI 👇 */}
        <CommentSection videoId={video._id} />

      </div>
    </div>
  );
}
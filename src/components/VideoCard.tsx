// Is line ko mita dein:
import Image from "next/image";
// Yeh batata hai ke VideoCard ko kya kya data milega
interface VideoCardProps {
  thumbnailUrl: string;
  title: string;
  channelName: string;
  views: string;
  uploadedAt: string;
}

function VideoCard({ thumbnailUrl, title, channelName, views, uploadedAt }: VideoCardProps) {
  return (
    <div className="flex flex-col gap-2 cursor-pointer">
      {/* Thumbnail Container */}
      <div className="relative w-full h-48 bg-gray-200 rounded-xl overflow-hidden hover:rounded-none transition-all duration-200">
        <img 
            src={thumbnailUrl} // Ab image fix nahi, balkay variable hai
            alt={title} 
            className="w-full h-full object-cover"
        />
      </div>

      {/* Video Details */}
      <div className="flex gap-3 mt-2">
        {/* Channel Icon (Filhal fix rakhte hain) */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {channelName[0]} {/* Channel ka pehla letter */}
          </div>
        </div>

        {/* Text Info */}
        <div className="flex flex-col">
          <h3 className="text-black dark:text-white font-semibold text-sm line-clamp-2">
            {title} {/* Title ab dynamic hai */}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {channelName}
          </p>
          <div className="text-gray-600 dark:text-gray-400 text-xs flex items-center">
            <span>{views}</span>
            <span className="mx-1">•</span>
            <span>{uploadedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
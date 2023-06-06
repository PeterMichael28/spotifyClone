"use client";
import React from "react";
import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import { useUser } from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import useUploadModal from "@/hooks/useUploadModal";
import useOnPlay from "@/hooks/useOnPlay";
import MediaItem from "./MediaItem";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import { Song } from "@/type";



type Props = {
  songs: Song[];
};

const Library = ({songs}: Props) => {
 const { user, subscription } = useUser();
 const uploadModal = useUploadModal();
 const authModal = useAuthModal();
 const subscribeModal = useSubscribeModal();

 const onPlay = useOnPlay(songs);

 const onClick = () => {
  if (!user) {
   return authModal.onOpen();
  }

  if (!subscription) {
    return subscribeModal.onOpen();
    }


  return uploadModal.onOpen();
 };

 return (
  <div className="flex flex-col">
   <div className="flex items-center justify-between px-5 pt-4">
    <div className="inline-flex items-center gap-x-2">
     <TbPlaylist size={26} className="text-neutral-500" />
     <p className="text-neutral-500 text-md font-medium">
      Your Library
     </p>
    </div>
    <AiOutlinePlus
     onClick={onClick}
     size={20}
     className="text-neutral-500 cursor-pointer hover:text-white transition duration-300"
    />
   </div>

   <div className="flex flex-col gap-y-2 mt-4 px-3">
        {songs.map((item) => (
          <MediaItem 
            onClick={(id: string) => onPlay(id)} 
            key={item.id} 
            data={item}
          />
        ))}
      </div>
  </div>
 );
};

export default Library;

"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Button from "./Button";
import useAuthModal from "@/hooks/useAuthModal";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useUser } from "@/hooks/useUser";
import { FaUserAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import usePlayer from "@/hooks/usePlayer";


type Props = {
 children: React.ReactNode;
 className?: string;
 account?: boolean
};

const Header = ({ children, className, account }: Props) => {
 const router = useRouter();
 const authModal = useAuthModal();

 const supabaseClient = useSupabaseClient();
 const { user } = useUser();
 const player = usePlayer()


//  log out function
 const handleLogout = async () => {
   const { error } = await supabaseClient.auth.signOut();


//    refresh any current song
   player.reset();

// refresh the page
   router.refresh();


//    if there is an error
   if (error) {
     toast.error(error.message);
   } else {
       toast.success('Logged out!')
   }
 }

 return (
  <div
   className={twMerge(
    "h-fit bg-gradient-to-b from-emerald-800 p-6",
    className
   )}
  >
   <div className={`w-full mb-4 flex items-center justify-between ${account && 'absolute top-0 bg-transparent left-0 pt-7 px-6 z-30'}`}>

    {/* desktop */}
    <div className="hidden md:flex gap-x-2 items-center relative z-20">
     <button className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition duration-300" onClick={() => router.back()}>
      <RxCaretLeft size={35} className="text-white" />
     </button>
     <button className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition duration-300" onClick={() => router.forward()}>
      <RxCaretRight size={35} className="text-white" />
     </button>
    </div>

{/* mobile */}
    <div className="flex md:hidden gap-x-2 items-center relative z-20">
        <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition duration-300" onClick={() => router.push('/')}>
            <HiHome className="text-black" size={20}/>
        </button>

        <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition duration-300" onClick={() => router.push('/search')}>
            <BiSearch className="text-black" size={20}/>
        </button>
    </div>

    
    <div className="flex justify-between items-center gap-x-4">
        {user ? (
            <div className="flex gap-x-4 items-center">

                {/* logout */}
            <Button 
              onClick={handleLogout} 
              className="bg-white px-6 py-2"
            >
              Logout
            </Button>

            {/* user profile */}
            <Button 
              onClick={() => router.push('/account')} 
              className="bg-white p-2"
            >
              <FaUserAlt/>
            </Button>
          </div>
        ) : (
            <>
            {/* sign up */}
                <div>
                    <Button className="bg-transparent text-neutral-300 font-medium" onClick={authModal.onOpen}>
                        Sign Up
                    </Button>
                </div>
                
            {/* login */}
                <div>
                    <Button className="bg-white px-6 py-2" onClick={authModal.onOpen}>
                        Login
                    </Button>
                </div>
            </>
        )}
   
    </div>

   
   </div>

   {children}
  </div>
 );
};

export default Header;

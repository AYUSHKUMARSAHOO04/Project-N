//17.4
// Project-N/components/Auth/Profile.tsx
"use client"
import React from 'react'
import { CircleUserRound, LogOut } from 'lucide-react'
import axios from "axios";
import { useRouter } from "next/navigation";

const Profile = ({user}) => {
    const router = useRouter();

    //18.2
    const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8080/auth/logout", {
        withCredentials: true, // cookie bhejna zaroori hai
      });
  
    router.push("/signup"); // logout ke baad login page par bhej do
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className='m-[1rem] absolute right-[-0.5rem] top-[1.5rem] md:top-[3rem]  p-[0.5rem] bg-white text-black rounded-sm'>
        {/* Profile Component Model  */}
        {/* Header */}
        <div className='relative flex justify-center items-center gap-[0.5rem] px-[1rem] py-[0.5rem] bg-gray-200 rounded-sm text-gray-800'>
            <div className='relative bottom-1'><CircleUserRound size={28} strokeWidth={1.5} /></div>
            <div className='flex flex-col justify-center'>
                <span className='font-[500] text-[0.9rem]'>Hi, {user.firstName}</span>
                <span className='relative bottom-1.5 text-[0.7rem]'>{user.username}</span>
            </div>
        </div>

        {/* //18.0 Logout button */}
        <div onClick={handleLogout} className='flex items-center gap-[0.5rem] p-[0.5rem] pb-0 text-gray-500 hover:text-red-500 cursor-pointer'>
            <span><LogOut size={16} /></span>
            <span className='text-[0.9rem] font-[500]'>Logout</span>
        </div>
    </div>
  )
}

export default Profile
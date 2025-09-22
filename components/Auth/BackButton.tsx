"use client"
import React from 'react'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from "next/navigation";

const BackButton = () => {
    const router = useRouter();

    const handleBack = () => {
        router.push('/');
    }

  return (
    <div onClick={handleBack} className='m-[1rem] absolute left-0 top-[1.5rem] md:top-[3rem] p-[0.5rem] bg-white text-black rounded-full cursor-pointer hover:shadow-md hover:bg-gray-100 transition'>
        <ChevronLeft size={20} strokeWidth={1.5} />
    </div>
  )
}

export default BackButton
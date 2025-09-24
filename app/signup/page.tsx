//3.1 
// Project-N/app/signup/page.tsx
"use client";

import React, { useRef, useState } from "react";
import ParticlesBackground from "@/components/shared/particle-background";
import CustomCursor from "@/components/shared/custom-cursor";
import BackButton from "@/components/Auth/BackButton";
import { useRouter } from 'next/navigation';
import axios from 'axios';

const page = () => {
  const router = useRouter();
    const [newSignupForm, setNewSignupForm] = useState({
        username: '',
        firstName: '',
        password: ''
    });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const base = process.env.NEXT_PUBLIC_API_URL;// Replace with your backend URL
            const response = await axios.post( `${base}/auth/local`, newSignupForm);
            if (response.status === 201) {
                alert('User created successfully!');
                router.push('/login'); // Redirect to listings page
            }
        } catch (error) {
            console.error('Error creating User:', error);
            alert('Failed to create user. Please try again.');
        }
    };

    const handleChange = (e) => {
        setNewSignupForm({ ...newSignupForm, [e.target.name]: e.target.value });
    };

  const handleGoogleLogin = () => {
    const base = process.env.NEXT_PUBLIC_API_URL;
    console.log("Redirecting to:", `${base}/auth/google`);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };
  
  return (
    <div suppressHydrationWarning>
        <ParticlesBackground />
        <BackButton/>
        <CustomCursor
                  containerRef={containerRef as React.RefObject<HTMLDivElement>}
                />
        <div className="flex h-screen justify-center items-center">
          
          <div className="flex flex-col p-[2rem] justify-center items-center bg-gray-200/5 backdrop-blur-sm rounded-xl shadow-lg">
               <div className="w-[2.5rem] h-[2.5rem] rounded-[50%] bg-white">
                <img className="contain rounded-sm" src="https://res.cloudinary.com/dnfq7ty1x/image/upload/v1757119623/204403551_robvni.jpg" alt="" />
               </div>

               <h1 className="text-[1.3rem] font-[500] pt-[1rem] pb-[0.5rem]">Sign in with email</h1>
               <p className="text-[0.8rem] text-gray-400">One AI. Infinite Care Health, Wellness</p>
               <p className="text-[0.8rem] text-gray-400"> & Beyond</p>

               <form onSubmit={handleSubmit} className="flex flex-col gap-[0.5rem] pt-[1.5rem]">
                <input name="firstName" onChange={handleChange} className="py-[0.5rem] px-[1rem] w-[18rem] border-1 border-white/5 rounded-xl" type="text" placeholder="Name" required/>
                <input name="username" onChange={handleChange} className="py-[0.5rem] px-[1rem] w-[18rem] border-1 border-white/5 rounded-xl" type="email" placeholder="Email" required/>
                <input name="password" onChange={handleChange} className="py-[0.5rem] px-[1rem] w-[18rem] border-1 border-white/5 rounded-xl" type="passport" placeholder="Password" required/>
                <div className="w-[100%] flex justify-end py-[0.3rem]"><p className="text-[0.7rem] text-gray-400"><a href="/login">Already have a account ?</a></p></div>
                <button className="cursor-pointer bg-white py-[0.5rem] text-black font-[500] text-[0.9rem] rounded-[0.6rem]">Get Started</button>
               </form>

               <p className="text-[0.7rem] text-gray-400 py-[0.5rem]">Or sign in with</p>

               <div onClick={handleGoogleLogin} className="cursor-pointer bg-white w-full flex gap-[1rem] justify-center items-center py-[0.5rem] text-black font-[500] text-[0.9rem] rounded-[0.6rem]">
                <img className="w-[1.3rem]" src="https://res.cloudinary.com/dnfq7ty1x/image/upload/v1757096292/Google__G__logo.svg_sadxax.webp" alt="" />
                <p>Sign in with Google</p>
               </div>
          </div>
        </div>
    </div>
  );
};

export default page;
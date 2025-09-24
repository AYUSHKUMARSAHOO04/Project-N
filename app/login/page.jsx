//3.0 
// Project-N/app/login/page.jsx
//26.0 
"use client";

import React, { useRef } from "react";
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ParticlesBackground from "@/components/shared/particle-background";
import CustomCursor from "@/components/shared/custom-cursor";
import BackButton from "@/components/Auth/BackButton";

export default function Page() {
  const router = useRouter();
    const [newLoginForm, setNewLoginForm] = useState({
        username: '',
        password: ''
    });
  const containerRef = useRef(null);

  const handleChange = (e) => {
        setNewLoginForm({ ...newLoginForm, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const base = process.env.NEXT_PUBLIC_API_URL; // Replace with your backend URL
            const response = await axios.post( `${base}/auth/login`, newLoginForm, {
                withCredentials: true
            });
            if (response.status === 200) {
                alert('User login successfully!');
                router.push('/'); // Redirect to listings page
            }
        } catch (error) {
            console.error('Error in logging User:', error);
            alert('Failed to login user. Please try again.');
        }
    };

  const handleGoogleLogin = () => {
    // redirect user to backend google auth route
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, "_self");
  };

  

  return (
    <div suppressHydrationWarning>
      <ParticlesBackground />
      <BackButton />
      <div ref={containerRef}>
        <CustomCursor containerRef={containerRef} />
        <div className="flex h-screen justify-center items-center">
          <div className="flex flex-col p-8 justify-center items-center bg-gray-200/5 backdrop-blur-sm rounded-xl shadow-lg w-[22rem]">
            <h1 className="text-xl font-medium pt-4 pb-2">Login</h1>
            <p className="text-sm text-gray-400">Welcome back! Please log in.</p>

            {/* Login form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 pt-6 w-full">
              <input
              onChange={handleChange}
                name="username"
                type="email"
                placeholder="Email"
                autoComplete="email"
                required
                className="py-2 px-3 border border-white/20 rounded-xl bg-transparent"
              />
              <input
              onChange={handleChange}
                name="password"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                required
                className="py-2 px-3 border border-white/20 rounded-xl bg-transparent"
              />

              <div className="w-full flex justify-end">
                <a href="/forgot-password" className="text-xs py-[0.5rem] cursor-pointer text-gray-400">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="cursor-pointer bg-white py-2 text-black font-medium text-sm rounded-lg"
              >
                Login
              </button>
            </form>

            {/* Divider */}
            <p className="text-sm text-gray-400 py-3">Or continue with</p>

            {/* Google login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="cursor-pointer bg-white w-full flex gap-3 justify-center items-center py-2 text-black font-medium text-sm rounded-lg"
            >
              <img
                className="w-5"
                src="https://res.cloudinary.com/dnfq7ty1x/image/upload/v1757096292/Google__G__logo.svg_sadxax.webp"
                alt="Google"
              />
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
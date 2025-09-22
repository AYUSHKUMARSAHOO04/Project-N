"use client";
import React, { useRef, useState } from "react";
import ParticlesBackground from "@/components/shared/particle-background";
import CustomCursor from "@/components/shared/custom-cursor";
import BackButton from "@/components/Auth/BackButton";
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const router = useRouter();
    const [newLoginForm, setNewLoginForm] = useState({
        username: ''
    });
  const containerRef = useRef(null);

  const handleChange = (e) => {
        setNewLoginForm({ ...newLoginForm, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const base = 'http://localhost:8080'; // Replace with your backend URL
            const response = await axios.post( `${base}/auth/forgot-password`, newLoginForm, {
                withCredentials: true
            });
            if (response.status === 200) {
                alert('Check your email');
                router.push('/forgot-password/done'); // Redirect to listings page
            }
        } catch (error) {
            console.error('Error in logging User:', error);
            alert('Failed to reset password. Please try again.');
        }
    };

  return (
    <div suppressHydrationWarning>
      <ParticlesBackground />
      <BackButton />
      <div ref={containerRef}>
        <CustomCursor containerRef={containerRef} />
        <div className="flex h-screen justify-center items-center">
          <div className="flex flex-col p-8 justify-center items-center bg-gray-200/5 backdrop-blur-sm rounded-xl shadow-lg w-[22rem]">
            <h1 className="text-xl font-medium pt-4 pb-2">Forgot Password</h1>
            <p className="text-sm text-gray-400 text-center">
              Enter your email address to reset your password.
            </p>

            {/* Forgot Password Form */}
            <form onSubmit={handleSubmit}  className="flex flex-col gap-[1rem] pt-6 w-full">
              <input
              onChange={handleChange}
                name="username"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                required
                className="py-2 px-3 border border-white/20 rounded-xl bg-transparent"
              />

              <button
                type="submit"
                className="cursor-pointer bg-white py-2 text-black font-medium text-sm rounded-lg"
              >
                Send Reset Link
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
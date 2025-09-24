//27.0 
"use client";
import React, { useRef, useState } from "react";
import ParticlesBackground from "@/components/shared/particle-background";
import CustomCursor from "@/components/shared/custom-cursor";
import BackButton from "@/components/Auth/BackButton";


export default function ForgotPasswordPage() {
  const containerRef = useRef(null);

  return (
    <div suppressHydrationWarning>
      <ParticlesBackground />
      <BackButton />
      <div ref={containerRef}>
        <CustomCursor containerRef={containerRef} />
        <div className="flex h-screen justify-center items-center">
          <div className="flex flex-col p-8 justify-center items-center bg-gray-200/5 backdrop-blur-sm rounded-xl shadow-lg w-[22rem]">
          <div className="w-[3.8rem] mb-[1rem]">
            <img src="https://res.cloudinary.com/dnfq7ty1x/image/upload/v1757632953/mail_gdg4s7.png" alt="" />
          </div>
            <h1 className="text-xl font-medium  pb-2">Check your email</h1>
            <p className="text-sm text-gray-400 text-center">
              A reset password link is sended to your email, kindly create a new password before expiring the session.
            </p>

            
          </div>
        </div>
      </div>
    </div>
  );
}
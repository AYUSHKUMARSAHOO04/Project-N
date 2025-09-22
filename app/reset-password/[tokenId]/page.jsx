"use client";
import React, { useRef, useState } from "react";
import ParticlesBackground from "@/components/shared/particle-background";
import CustomCursor from "@/components/shared/custom-cursor";
import BackButton from "@/components/Auth/BackButton";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const tokenId = params.tokenId;

  const [password, setPassword] = useState("");
  const containerRef = useRef(null);

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8080/auth/reset-password/${tokenId}`,
        { password }
      );
      console.log(response.data);

      alert("Password created successfully");

      if (response.data.passwordChange) {
        router.push("/login");
      } else {
        router.push("/forgot-password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Error in resetting password");
      router.push("/forgot-password");
    }
  };

  return (
    <div suppressHydrationWarning ref={containerRef}>
      <ParticlesBackground />
      <BackButton />
      <CustomCursor containerRef={containerRef} />

      <div className="flex h-screen justify-center items-center">
        <div className="flex flex-col p-8 justify-center items-center bg-gray-200/5 backdrop-blur-sm rounded-xl shadow-lg w-[22rem]">
          <h1 className="text-xl font-medium pt-4 pb-2">Reset Password</h1>
          <p className="text-sm text-gray-400 text-center">
            Create your new password below.
          </p>

          {/* Reset Password form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-[1rem] pt-6 w-full"
          >
            <input
              onChange={handleChange}
              name="password"
              type="password"
              placeholder="Create new password"
              required
              className="py-2 px-3 border border-white/20 rounded-xl bg-transparent"
            />

            <button
              type="submit"
              className="cursor-pointer bg-white py-2 text-black font-medium text-sm rounded-lg"
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;

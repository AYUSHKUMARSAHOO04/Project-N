"use client";

import { useRef } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { ThemeProvider } from "next-themes";
import ParticlesBackground from "@/components/shared/particle-background";

import NoiseTexture from "@/components/shared/noise-texture";

import Healthmate from "@/components/Healthmate";
import CustomCursor from "@/components/shared/custom-cursor";
export default function Home() {
  //19.0
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  //19.1 if not logged in, redirect to signup
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL;
    axios
      .get(`${base}/auth/user`, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
        router.push("/signup");
      });
  }, [router]);

  //19.2
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Loading...
      </div>
    );
  }


  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <main
        ref={containerRef}
        className="relative min-h-screen bg-gradient-to-b from-black to-gray-900 dark:from-black dark:to-gray-900 text-white overflow-hidden"
      >
          <CustomCursor
                  containerRef={containerRef as React.RefObject<HTMLDivElement>}
                />
        <NoiseTexture />
        <ParticlesBackground />
          <>
           <Healthmate/>
          </>
      </main>
    </ThemeProvider>
  );
}

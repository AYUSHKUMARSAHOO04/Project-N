"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';

import { Suspense } from "react";
import VideoCallScreen from "../_components/video_call";

function VideoCallWrapper() {
  const [user, setUser] = useState(null);
    const [authloading, setAuthLoading] = useState(true);
    const router = useRouter();

    //checking user authentication
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL;
    axios
      .get(`${base}/auth/user`, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.user);
        setAuthLoading(false);
      })
      .catch(() => {
        setUser(null);
        setAuthLoading(false);
        router.push("/signup");
      });
  }, [router]);

  if (authloading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Loading...
      </div>
    );
  }
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VideoCallScreen />
    </Suspense>
  );
}

export default VideoCallWrapper;

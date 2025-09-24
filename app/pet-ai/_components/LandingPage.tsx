"use client";
import ParticlesBackground from "@/components/shared/particle-background";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
    const callerName = "Pet AI Assistant";

    return (
    <div className="min-h-screen w-full  bg-cover bg-center relative" style={{ backgroundImage: "url('/PetAiBg.jpg')" }}>
      <ParticlesBackground/>
      <div className="w-full h-full flex flex-col gap-8 lg:gap-10 overflow-hidden ">
        <div className="flex gap-2 justify-between items-center mb-20 lg:mb-10 px-4">
          <Link href="/VirzeonX">
            <div className="bg-white bg-opacity-10 rounded-full p-3 transition-all duration-200 hover:bg-opacity-20 active:bg-white active:bg-opacity-30 active:scale-95">
              <ArrowLeft className="size-4 md:size-5 text-black" />
            </div>
          </Link>
 
          {/* Title and subtitle */}
          <div className="absolute left-1/2 transform -translate-x-1/2  top-20  md:top-4">
            <h1 className="text-[#DBEAFE] text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-center">
              Pet AI
            </h1>
            <p className="text-[#dbd4d7] text-center font-bold text-balance md:text-2xl lg:text-3xl leading-none tracking-normal ">
              Virtual Veterinary Assistant
            </p>
          </div>
          <div className="flex gap-4 mt-5">
            <Link href={`/callscreen/audio_call?callerName=${encodeURIComponent(callerName)}&app=pet-ai`} aria-label="Start audio call with Pet AI Assistant">
              <div className="bg-[#16a34a] rounded-full p-3 group hover:bg-[#15803d] shadow-lg hover:shadow-xl transition-all duration-300 active:bg-white active:text-[#16a34a] active:scale-95">
                <Phone className="size-4 md:size-5 text-white group-hover:text-gray-100 transition-all duration-300 active:text-[#16a34a]" />
              </div>
            </Link>
            <Link href={`/callscreen/video_call?callerName=${encodeURIComponent(callerName)}&app=pet-ai`} aria-label="Start video call with Pet AI Assistant">
              <div className="bg-[#dc2626] rounded-full p-3 group hover:bg-[#b91c1c] shadow-lg hover:shadow-xl transition-all duration-300 active:bg-white active:text-[#dc2626] active:scale-95">
                <Video className="size-4 md:size-5 text-white group-hover:text-gray-100 transition-all duration-300 active:text-[#dc2626]" />
              </div>
            </Link>
          </div>
        </div>
        <div className="lg:mt-[12%] flex flex-wrap justify-center gap-10 mt-30 px-10 lg:px-36">
            <Card
            title="Pet Health Check"
            imagePath="/Card-1.png" />
            <Card
              title="Nutrition Advice"
              imagePath="/Card-2.png" />
          <Card
            title="Pet Care Tips"
          imagePath="/Card-3.png" />
        </div>
      </div>
  </div>
  );
}

function Card({
    title,
    imagePath,
  }: {
    title: string;
    imagePath: string;
  }){
    return(
        <div className="bg-[#1f2937] py-5 px-5 md:px-10 flex flex-col items-center justify-center gap-6 rounded-3xl mb-3 shadow-md transition-transform transform hover:-translate-y-4 hover:shadow-[0_6px_30px_rgba(215,180,200,1)]">
            <div className="h-[140px] w-[140px] rounded-full overflow-hidden shadow-[0_4px_20px_rgba(255,255,255,1)] flex justify-center">
                <Image
                    src={imagePath || "/placeholder.svg"}
                    alt={title}
                    width={140}
                    height={120}
                    className="object-center rounded-full"
                />
            </div>
            <div>
                <h1 className="text-white font-semibold text-center">{title}</h1>
            </div>
            <Link href={"/pet-ai/chat"}>
              <Button className="bg-white text-black hover:bg-[#f0f0f0] rounded-full py-2 px-6 text-sm font-semibold transition duration-300 shadow hover:shadow-md focus:outline-none active:bg-[#e0e0e0] active:text-gray-500">
                  Get Started
              </Button>
            </Link>
        </div>
    )
}

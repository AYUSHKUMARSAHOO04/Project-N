'use client'
import CustomCursor from "@/components/shared/custom-cursor";
import ParticlesBackground from "@/components/shared/particle-background";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  hover: {
    y: -8,
    scale: 1.03,
    transition: {
      duration: 0.4,
      ease: "easeInOut"
    }
  }
};

const imageVariants = {
  hover: {
    scale: 1.12,
    rotate: 2,
    transition: {
      duration: 0.5,
      ease: "backOut"
    }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0 5px 15px rgba(147, 51, 234, 0.4)",
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.95
  }
};

export default function LandingPage() {
  const callerName = "MindEase Assistant";
  const containerRef = useRef<HTMLDivElement>(null);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div ref={containerRef}
    className="min-h-screen w-full  bg-[#000a0b] bg-center relative flex items-start justify-center"
    
  >
    <ParticlesBackground/>
    <img src="/mindease-bg.jpg" alt="" className="absolute min-w-[780px]  lg:w-[1000px] top-0 " />
      <CustomCursor
        containerRef={containerRef as React.RefObject<HTMLDivElement>}
      />
      <ParticlesBackground/>
      <div className="absolute w-full h-full flex flex-col gap-8 lg:gap-10 overflow-x-hidden z-10">
        <div className="flex gap-2 justify-between items-center mb-20 lg:mb-10 px-4 lg:px-10">
        <Link href="/VirzeonX" className="z-10 bg-white bg-opacity-10 rounded-full p-2 md:p-3 mt-5 md:mt-0 hover:bg-opacity-20 active:bg-opacity-30 transition">
  <ArrowLeft className="size-4 md:size-5 text-black" />
</Link>

          {/* Title and subtitle */}
          <div className="absolute left-1/2 transform -translate-x-1/2  top-16  md:top-4 w-full" >
            <h1 className="text-[#1760f4] text-4xl md:text-4xl lg:text-5xl font-bold mb-2 text-center">
              MindEase 
            </h1>
            <p className="text-white text-center font-bold text-balance md:text-2xl leading-none tracking-normal">
              Mental Wellness & Lifestyle Coach
            </p>
          </div>

          <div className="absoute flex gap-4 mt-5 lg:mt-16">
            <Link href={`/callscreen/audio_call?callerName=${encodeURIComponent(callerName)}&app=mindease`} aria-label="Start audio call with MindEase Assistant">
              <div className="bg-[#16a34a] rounded-full p-2 md:p-3">
                <Phone className="size-4 md:size-5 text-white" />
              </div>
            </Link>
            <Link href={`/callscreen/video_call?callerName=${encodeURIComponent(callerName)}&app=mindease`} aria-label="Start video call with MindEase Assistant">
              <div className="bg-[#dc2626] rounded-full p-2 md:p-3">
                <Video className="size-4 md:size-5 text-white " />
              </div>
            </Link>
          </div>
        </div>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="visible"
          className="lg:mt-[11%] grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 items-center justify-center  gap-4 md:gap-9 mt-30 px-3 mx-auto"
        >
          <Card
            title="Guided Meditation" imagePath="/Guided-mindease.png" />
          <Card
            title="Hobby-Based Theraphy"
            imagePath="/Hobby-mindease.png"
          />
          <Card
            title="Daily Stress Check"
            imagePath="/Daily-mindease.png"
          />
          <Card
            title="Mindfulness Tips"
            imagePath="/Mindfull-mindease.png"
          />
           <Card
            title="Early Adult Support"
            imagePath="/Mindfull-mindease.png"
          />
          <Card
            title="Indian Grandparent"
            imagePath="/Mindfull-mindease.png"
          />
        </motion.div>
      </div>
    </div>

  );
}

function Card({ title, imagePath }: { title: string; imagePath: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const rotateX = useTransform(y, [-100, 100], [12, -12]);
  const rotateY = useTransform(x, [-100, 100], [-12, 12]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  // Determine the link based on the title
  const getLinkPath = () => {
    if (title === "Daily Stress Check") {
      return "/bubble";
    }
     if (title === "Hobby-Based Theraphy") {
      return "/echo-match";
    }
    if (title === "Guided Meditation") {
      return "/bloom-buds";
    }
    if (title === "Early Adult Support") {
      return "/earlyAdult";
    }
    if (title === "Indian Grandparent") {
      return "/indiangrand";
    }
    return "/mindease/chat";
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-[#1f2937] h-[90%] md:h-[100%] py-3 px-5 md:px-7 flex flex-col items-center justify-center gap-1 rounded-3xl shadow-md 
        relative overflow-hidden transform-gpu
        before:absolute before:inset-0 before:rounded-3xl before:border before:border-purple-500/20
        before:bg-gradient-to-br before:from-purple-600/0 before:to-violet-400/0
        hover:before:from-purple-600/30 hover:before:to-violet-400/30
        before:z-0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
        hover:shadow-[0_8px_30px_rgba(147,51,234,0.6)] hover:border-purple-500/30
        transition duration-200 ease-in-out"
    >
      {/* Ambient glow effect */}
      <motion.div 
        className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 
                  bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.25),transparent_70%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.7 }}
      />
      
      {/* Moving highlight */}
      <motion.div
        className="absolute -inset-1/2 z-0 transition-opacity duration-700 
                   bg-gradient-conic from-purple-900 via-purple-700 to-violet-400 blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isHovered ? 0.4 : 0,
          rotate: isHovered ? [0, 360] : 0,
          scale: isHovered ? [1, 1.05, 1] : 1,
        }}
        transition={{ 
          opacity: { duration: 0.7 },
          rotate: { repeat: Infinity, duration: 10, ease: "linear" },
          scale: { repeat: Infinity, duration: 4, ease: "easeInOut" }
        }}
      />
      
      <div className="relative flex items-center justify-center transform-gpu" style={{ transformStyle: "preserve-3d" }}>
        {/* Image glow effect */}
        <motion.div 
          className="absolute inset-2 rounded-full bg-gradient-to-tr from-white/20 to-white/5 blur-md transition-opacity duration-500 z-0"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            boxShadow: isHovered ? ["0 0 0px rgba(147,51,234,0)", "0 0 25px rgba(147,51,234,0.6)", "0 0 15px rgba(147,51,234,0.5)"] : "0 0 0px rgba(147,51,234,0)",
          }}
          transition={{ 
            opacity: { duration: 0.5 },
            boxShadow: { 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 2.5 
            }
          }}
        />
        <motion.div
          variants={imageVariants}
          whileHover="hover"
          className="relative z-10 transform-gpu" 
          style={{ transform: "translateZ(30px)" }}
        >
          <Image
            src={imagePath || "/placeholder.svg"}
            alt={title}
            width={180}
            height={180}
            className="relative w-50 md:w-44 object-center rounded-full transition-all duration-500"
            style={{
              boxShadow: isHovered ? "0 0 20px rgba(147,51,234,0.7)" : "none"
            }}
          />
        </motion.div>
      </div>

      <div className="transform-gpu" style={{ transform: "translateZ(20px)" }}>
        <motion.h1 
          className="text-white text-sm md:text-balance font-semibold text-center mb-3 transition-colors duration-500"
          style={{ 
            color: isHovered ? "#c084fc" : "white",
            textShadow: isHovered ? "0 0 8px rgba(147,51,234,0.7)" : "none"
          }}
        >
          {title}
        </motion.h1>
      </div>

      <Link href={getLinkPath()} className="pb-4 transform-gpu" style={{ transform: "translateZ(25px)" }}>
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button className="bg-white text-black hover:bg-[#f0f0f0] rounded-full py-2 px-6 text-sm font-semibold transition duration-300 shadow hover:shadow-md focus:outline-none active:bg-[#e0e0e0] active:text-gray-500
                    relative overflow-hidden 
                    before:absolute before:inset-0 before:w-full before:h-full before:bg-gradient-to-r
                    before:from-transparent before:via-white/60 before:to-transparent before:translate-x-[-100%]"
            style={{
              boxShadow: isHovered ? "0 0 15px rgba(255,255,255,0.5)" : "none"
            }}
          >
            Get Started
          </Button>
        </motion.div>
      </Link>
    </motion.div>
  );
}
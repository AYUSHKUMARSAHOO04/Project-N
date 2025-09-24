"use client"
import { ArrowLeft, Phone, Video, Activity, TrendingUp, Bell, Upload } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import CustomCursor from "@/components/shared/custom-cursor"
import { useRef, useEffect, useState } from "react"
import ParticlesBackground from "@/components/shared/particle-background"
import { motion, useMotionValue, useTransform } from "framer-motion"

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

export default function HealthMate() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const callerName = "HealthMate Assistant";

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

  // Detect mobile device on mount
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    setIsMobile(
      /iphone|ipod|ipad|android/i.test(userAgent) // Check if it's a mobile device
    )
  }, [])

  return (
    <>
      {/* Custom cursor is only enabled for non-mobile devices */}
      {!isMobile && <CustomCursor containerRef={containerRef as React.RefObject<HTMLDivElement>} />}
       
      <div className="min-h-screen bg-black text-white relative overflow-hidden"  style={{background:"url('/image 52.png')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0  z-0 opacity-80">
          {/* <Image src="/image 52.png" alt="Pills background" fill className="object-cover" /> */}
        </div>
        <ParticlesBackground />

        <div className="relative z-10 w-full h-full flex flex-col gap-8 lg:gap-10 overflow-hidden">
          <div className="flex gap-2 justify-between items-center mb-20 lg:mb-10 px-4">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1.1 }}
              className="bg-white bg-opacity-10 rounded-full p-3 transition-all duration-200 hover:bg-opacity-20 active:bg-white active:bg-opacity-30 active:scale-95"
            >
              <Link href="/VirzeonX">
                <ArrowLeft className="size-4 md:size-5 text-black" />
              </Link>
            </motion.div>

            {/* Title and subtitle */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-20 md:top-4">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[#2563eb] text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-center"
              >
                HealthMate
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="font-bold text-lg lg:text-2xl leading-none tracking-normal text-center self-stretch whitespace-nowrap"
              >
                AI Powered Personal Healthcare Companion
              </motion.p>
            </div>
            <div className="flex gap-4 mt-5">
              <Link href={`/callscreen/audio_call?callerName=${encodeURIComponent(callerName)}&app=healthmate`} aria-label="Start audio call with HealthMate Assistant">
                <motion.div 
                  whileHover={{ scale: 1.1, backgroundColor: "#15803d" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#16a34a] rounded-full p-3 group hover:bg-[#15803d] shadow-lg hover:shadow-xl transition-all duration-300 active:bg-white active:text-[#16a34a] active:scale-95"
                >
                  <Phone className="size-4 md:size-5 text-white group-hover:text-gray-100 transition-all duration-300 active:text-[#16a34a]" />
                </motion.div>
              </Link>
              <Link href={`/callscreen/video_call?callerName=${encodeURIComponent(callerName)}&app=healthmate`} aria-label="Start video call with HealthMate Assistant">
                <motion.div 
                  whileHover={{ scale: 1.1, backgroundColor: "#b91c1c" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#dc2626] rounded-full p-3 group hover:bg-[#b91c1c] shadow-lg hover:shadow-xl transition-all duration-300 active:bg-white active:text-[#dc2626] active:scale-95"
                >
                  <Video className="size-4 md:size-5 text-white group-hover:text-gray-100 transition-all duration-300 active:text-[#dc2626]" />
                </motion.div>
              </Link>
            </div>
          </div>

          {/* Container for Feature Cards */}
          <div className="mt-20 lg:mt-[120px] px-4 lg:px-36">
            <motion.div 
              variants={container}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap justify-center gap-6 lg:gap-8"
            >
              <FeatureCard title="Check Vital Signs" imagePath="/vital.svg" icon="vital" />
              <FeatureCard title="Monitor Health Trends" imagePath="/Monitor_health.svg" icon="trends" />
              <FeatureCard title="Receive Health Alerts" imagePath="/healthcare-alert.svg" icon="alerts" />
              <FeatureCard title="Upload Health Reports" imagePath="/doctor-ext.svg" icon="upload" />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}

const FeatureCard = ({ title, imagePath, icon }: { title: string; imagePath: string; icon: string }) => {
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

  const renderIcon = () => {
    const iconSize = 24;
    const iconColor = "rgba(59, 130, 246, 0.9)"; // blue-500
    
    switch(icon) {
      case "vital":
        return (
          <motion.div
            animate={{ 
              rotate: isHovered ? [0, -10, 10, -10, 10, 0] : 0
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "loop", 
              duration: 2.5,
              repeatDelay: 1
            }}
          >
            <Activity size={iconSize} color={iconColor} strokeWidth={1.5} />
          </motion.div>
        );
      
      case "trends":
        return (
          <motion.div
            animate={{ 
              rotate: isHovered ? [0, -10, 10, -10, 10, 0] : 0
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "loop",
              duration: 2.5,
              ease: "easeInOut" 
            }}
          >
            <TrendingUp size={iconSize} color={iconColor} strokeWidth={1.5} />
          </motion.div>
        );
      
      case "alerts":
        return (
          <motion.div
            animate={{ 
              rotate: isHovered ? [0, -10, 10, -10, 10, 0] : 0
            }}
            transition={{ 
             repeat: Infinity, 
              repeatType: "loop",
              duration: 2.5,
              ease: "easeInOut" 
            }}
          >
            <Bell size={iconSize} color={iconColor} strokeWidth={1.5} />
          </motion.div>
        );
      
      case "upload":
        return (
          <motion.div
            animate={{ 
              rotate: isHovered ? [0, -10, 10, -10, 10, 0] : 0
            }}
            transition={{ 
            repeat: Infinity, 
              repeatType: "loop",
              duration: 2.5,
              ease: "easeInOut"
            }}
          >
            <Upload size={iconSize} color={iconColor} strokeWidth={1.5} />
          </motion.div>
        );
        
      default:
        return null;
    }
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
      className="w-[211.879px] p-3 lg:p-6 flex flex-col items-center justify-center gap-6 rounded-[24.072px] bg-[#1F2937] shadow-md transition-all duration-500 ease-out
        relative overflow-hidden
        before:absolute before:inset-0 before:rounded-[24.072px] before:border before:border-blue-500/20
        before:bg-gradient-to-br before:from-blue-600/0 before:to-cyan-400/0
        hover:before:from-blue-600/30 hover:before:to-cyan-400/30
        before:z-0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
        hover:shadow-[0_0_25px_rgba(59,130,246,0.45)] hover:border-blue-500/30"
    >
      {/* Ambient glow effect */}
      <motion.div 
        className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 
                  bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.25),transparent_70%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.7 }}
      />
      
      {/* Moving highlight */}
      <motion.div
        className="absolute -inset-1/2 z-0 transition-opacity duration-700 
                   bg-gradient-conic from-blue-900 via-blue-700 to-cyan-400 blur-3xl"
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
      
      {/* SVG Icon in top right corner - only visible on hover */}
      <motion.div 
        className="absolute top-2 right-2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        {renderIcon()}
      </motion.div>

      <div className="relative mb-3 lg:mb-4 w-full aspect-square max-w-[130px] transform-gpu" style={{ transformStyle: "preserve-3d" }}>
        {/* Image glow effect */}
        <motion.div 
          className="absolute inset-2 rounded-full bg-gradient-to-tr from-white/20 to-white/5 blur-md transition-opacity duration-500 z-0"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            boxShadow: isHovered ? ["0 0 0px rgba(59,130,246,0)", "0 0 25px rgba(59,130,246,0.6)", "0 0 15px rgba(59,130,246,0.5)"] : "0 0 0px rgba(59,130,246,0)",
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
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-30"></div>
        <div className="relative overflow-hidden w-full h-full rounded-full z-10 transform-gpu" style={{ transform: "translateZ(30px)" }}>
          <motion.div
            variants={imageVariants}
            whileHover="hover"
            className="relative z-10 w-full h-full transform-gpu"
          >
            <Image 
              src={imagePath || "/placeholder.svg"} 
              alt={title} 
              fill 
              className="object-cover transition-all duration-500" 
              style={{
                boxShadow: isHovered ? "0 0 20px rgba(59,130,246,0.7)" : "none"
              }}
            />
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 sm:gap-4 lg:gap-[20.34px] w-full transform-gpu" style={{ transform: "translateZ(20px)" }}>
        <motion.h3 
          className="text-white text-center font-medium text-xs sm:text-sm lg:text-[13.56px] transition-colors duration-500"
          style={{
            color: isHovered ? "#60a5fa" : "white",
            textShadow: isHovered ? "0 0 8px rgba(59,130,246,0.7)" : "none"
          }}
        >
          {title}
        </motion.h3>
        <Link
          href="/HealthMatesecondLanding"
          className="bg-white text-black rounded-full px-3 sm:px-4 lg:px-6 py-1 sm:py-1.5 lg:py-2 text-[10px] sm:text-xs lg:text-sm font-medium hover:bg-opacity-90 transition-colors
                    relative overflow-hidden 
                    before:absolute before:inset-0 before:w-full before:h-full before:bg-gradient-to-r
                    before:from-transparent before:via-white/60 before:to-transparent before:translate-x-[-100%]"
          style={{
            boxShadow: isHovered ? "0 0 15px rgba(255,255,255,0.5)" : "none"
          }}
        >
          Get Started
        </Link>
      </div>
    </motion.div>
  )
}
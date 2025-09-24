"use client"
import CustomCursor from "@/components/shared/custom-cursor";
import { ArrowLeft, Phone, Video, AlarmClock, AlertTriangle, HeartPulse, Stethoscope, Calendar, MessageCircleHeart, Users, Pill, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
    boxShadow: "0 5px 15px rgba(99, 102, 241, 0.4)",
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.95
  }
};

export default function GoldencareLandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const callerName = "Goldencare Assistant";
  
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
    <div
      className="min-h-screen w-full bg-cover bg-center relative"
      style={{ backgroundImage: "url('/goldencare-bg.png')" }}
    >
      <CustomCursor
        containerRef={containerRef as React.RefObject<HTMLDivElement>}
      />
      <div className="w-full h-full flex flex-col gap-6 lg:gap-8 overflow-hidden">
        <div className="flex gap-2 justify-between items-center mb-20 lg:mb-10 px-4">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.1 }}
            className="bg-white bg-opacity-10 mt-5 backdrop-filter backdrop-blur-md rounded-full p-3"
          >
            <Link href="/VirzeonX">
              <ArrowLeft className="size-3 md:size-4 text-black" />
            </Link>
          </motion.div>

          <div className="absolute left-1/2 transform -translate-x-1/2 top-12 md:top-4 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 bg-clip-text text-transparent"
            >
              Goldencare
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-bold md:text-xl leading-none tracking-normal bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 bg-clip-text text-transparent"
            >
              Elder Care System
            </motion.p>
          </div>

          <div className="flex gap-2 md:gap-4 mt-5">
            <Link href={`/callscreen/audio_call?callerName=${encodeURIComponent(callerName)}&app=goldencare`} aria-label="Start audio call with Goldencare Assistant">
              <motion.div 
                whileHover={{ scale: 1.1, backgroundColor: "#0ea5e9" }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#1db302] rounded-full p-3"
              >
                <Phone className="size-3 md:size-5 text-white" />
              </motion.div>
            </Link>
            <Link href={`/callscreen/video_call?callerName=${encodeURIComponent(callerName)}&app=goldencare`} aria-label="Start video call with Goldencare Assistant">
              <motion.div 
                whileHover={{ scale: 1.1, backgroundColor: "#ec4899" }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#f00909] rounded-full p-3"
              >
                <Video className="size-3 md:size-5 text-white" />
              </motion.div>
            </Link>
          </div>
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="visible"
          className="lg:mt-[11%]  grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 items-center justify-center gap-4 md:gap-9 mt-30 px-3 mx-auto"
        >
          <Card
            title="Emergency Help"
            imagePath="/Emergency-Help.png"
            icon="emergency"
          />
          <Card
            title="Doctor Appointment"
            imagePath="/Doctor-Appointment.png"
            icon="doctor"
          />
          <Card
            title="Friendly Chat"
            imagePath="/Friendly-Chat.png"
            icon="chat"
          />
          <Card
            title="Medication"
            imagePath="/Medication-Reminder.png"
            icon="medication"
          />
        </motion.div>
      </div>
    </div>
  );
}

function Card({
  title,
  imagePath,
  icon,
}: {
  title: string;
  imagePath: string;
  icon: string;
}) {
  const router = useRouter();
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

  const handleNavigation = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const username = localStorage.getItem('goldencare_username');
      if (!username) {
        router.push('/goldencare/check-in');
      } else {
        router.push(path);
      }
    }
  };

  const renderIcon = () => {
    const iconSize = 24; // Reduced size for top corner
    const iconColor = "rgba(245, 158, 11, 0.9)"; // amber-500
    
    switch(icon) {
      case "emergency":
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
            <AlertTriangle size={iconSize} color={iconColor} strokeWidth={1.5} />
          </motion.div>
        );
      
      case "doctor":
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
            <Stethoscope size={iconSize} color={iconColor} strokeWidth={1.5} />
          </motion.div>
        );
      
      case "chat":
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
            <MessageCircleHeart size={iconSize} color={iconColor} strokeWidth={1.5} />
          </motion.div>
        );
      
      case "medication":
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
            <Pill size={iconSize} color={iconColor} strokeWidth={1.5} />
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
      className="bg-white/10 backdrop-filter backdrop-blur-lg py-3 px-3 flex flex-col items-center justify-center gap-0 rounded-xl mb-3 
        relative overflow-hidden w-full md:min-w-[200px] max-w-[350px] mx-auto transition-all duration-500 ease-out
        before:absolute before:inset-0 before:rounded-xl before:border before:border-amber-500/20
        before:bg-gradient-to-br before:from-amber-600/0 before:to-yellow-400/0
        hover:before:from-amber-600/30 hover:before:to-yellow-400/30
        before:z-0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
        hover:shadow-[0_0_25px_rgba(217,119,6,0.45)] hover:border-amber-500/30"
    >
      {/* Ambient glow effect */}
      <motion.div 
        className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 
                  bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.25),transparent_70%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.7 }}
      />
      
      {/* Moving highlight */}
      <motion.div
        className="absolute -inset-1/2 z-0 transition-opacity duration-700 
                   bg-gradient-conic from-amber-900 via-amber-700 to-yellow-400 blur-3xl"
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
      
      <div className="relative w-28 h-28 flex items-center justify-center transform-gpu" style={{ transformStyle: "preserve-3d" }}>
        {/* Image glow effect */}
        <motion.div 
          className="absolute inset-2 rounded-full bg-gradient-to-tr from-white/20 to-white/5 blur-md transition-opacity duration-500 z-0"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            boxShadow: isHovered ? ["0 0 0px rgba(217,119,6,0)", "0 0 25px rgba(217,119,6,0.6)", "0 0 15px rgba(245,158,11,0.5)"] : "0 0 0px rgba(217,119,6,0)",
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
            width={120}
            height={120}
            className="object-center rounded-full transition-all duration-500"
            style={{
              boxShadow: isHovered ? "0 0 20px rgba(245,158,11,0.7)" : "none"
            }}
          />
        </motion.div>
      </div>
      <div className="h-10 w-full"></div>
      
      <div className="mb-2 px-2 transform-gpu" style={{ transform: "translateZ(20px)" }}>
        <motion.h1 
          className="text-white font-semibold text-center text-[12px] md:text-sm transition-colors duration-500"
          style={{
            color: isHovered ? "#fcd34d" : "white",
            textShadow: isHovered ? "0 0 8px rgba(217,119,6,0.7)" : "none"
          }}
        >
          {title}
        </motion.h1>
      </div>
      
      <div className="flex flex-col gap-2 w-full px-2 mb-2 transform-gpu" style={{ transform: "translateZ(25px)" }}>
        <motion.button 
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={(e) => handleNavigation(e, '/Healthmate?category=biopsy')}
          className="bg-white/80 backdrop-filter backdrop-blur-sm text-black rounded-full py-2 px-3 text-xs font-medium text-center
                    relative overflow-hidden 
                    before:absolute before:inset-0 before:w-full before:h-full before:bg-gradient-to-r
                    before:from-transparent before:via-white/60 before:to-transparent before:translate-x-[-100%]"
          style={{
            boxShadow: isHovered ? "0 0 15px rgba(255,255,255,0.5)" : "none"
          }}
        >
          Go to Chatbot
        </motion.button>
        <motion.button 
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={(e) => handleNavigation(e, '/goldencare/check-in')}
          className="bg-gradient-to-r from-amber-900 via-amber-700 to-yellow-400 text-white rounded-full py-2 px-3 text-xs font-medium text-center
                    relative overflow-hidden
                    before:absolute before:inset-0 before:w-full before:h-full before:bg-gradient-to-r
                    before:from-transparent before:via-white/30 before:to-transparent before:translate-x-[-100%]"
          style={{
            boxShadow: isHovered ? "0 0 20px rgba(217,119,6,0.7)" : "none"
          }}
        >
          Health Check-in
        </motion.button>
      </div>
    </motion.div>
  );
}
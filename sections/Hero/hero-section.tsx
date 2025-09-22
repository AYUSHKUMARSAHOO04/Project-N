"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import Signup from '@/components/Auth/signup';

const SPRING_CONFIG = { damping: 30, stiffness: 400, mass: 1 };
const ROTATING_WORDS = ["Health", "Wellness&", "Beyond"];

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mouseXSpring = useSpring(0, SPRING_CONFIG);
  const mouseYSpring = useSpring(0, SPRING_CONFIG);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex(
        (prevIndex) => (prevIndex + 1) % ROTATING_WORDS.length
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    interface MousePosition {
      x: number;
      y: number;
    }

    const handleMouseMove = (e: MouseEvent): void => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y } as MousePosition);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const normalizedX = (x - centerX) / centerX;
      const normalizedY = (y - centerY) / centerY;

      mouseXSpring.set(normalizedX);
      mouseYSpring.set(normalizedY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseXSpring, mouseYSpring]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="home"
      ref={ref}
      className="h-screen items-center justify-center px-4 relative overflow-hidden"
    >
      {/* //15.0 */}
      <Signup/>
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-0">
          <Image
            src="/Landing-page-hero.png"
            alt="AI Healthcare Background"
            fill
            priority
            className="object-cover object-center opacity-50"
            style={{
              filter: "brightness(0.8) blur(1px)",
            }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-[30%] left-1/6 sm:left-[35%] sm:top-[60%] sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 z-10 w-full md:w-auto"
          style={{ scale }}
        >
        
          <motion.div className="flex flex-col items-start justify-center space-y-2 max-w-lg md:max-w-xl lg:max-w-3xl">
            <motion.h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              OneAI.
            </motion.h1>
            <div className="flex flex-row items-start sm:items-center gap-1 sm:gap-2">
              <motion.h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white whitespace-nowrap">
                Infinite Care.
              </motion.h2>
              <motion.div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white/60 flex items-center">
                <div className="relative h-10 sm:h-12 md:h-16 lg:h-20 w-40 sm:w-48 md:w-60 lg:w-80 inline-flex items-center justify-center overflow-hidden font-bold">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentWordIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="absolute"
                    >
                      {ROTATING_WORDS[currentWordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

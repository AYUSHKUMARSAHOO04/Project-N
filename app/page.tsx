"use client";

import { useEffect, useState, useRef } from "react";
import IntroAnimation from "@/components/shared/intro-animation";
import Navbar from "@/sections/marginals/navbar";
// import ChatbotServices from "@/sections/ChatBotServices/chatbot-services";
import FloatingChatbot from "@/components/shared/floating-chatbot";
import { ThemeProvider } from "next-themes";
import HeroSection from "@/sections/Hero/hero-section";
// import FeaturesSection from "@/sections/Features/features-section";
// import FaqSection from "@/sections/FAQs/faq-section";
import Footer from "@/sections/marginals/footer";
import ParticlesBackground from "@/components/shared/particle-background";
import CustomCursor from "@/components/shared/custom-cursor";
import ScrollProgress from "@/components/shared/scroll-progress";
// import NoiseTexture from "@/components/shared/noise-texture";
import MarqueeText from "@/components/marquee-text";
// import VerticalMenuIndicator from "@/components/shared/vertical-menu-indicator";
import { useScroll } from "framer-motion";
import About from "@/components/About/About";
// import TeamMembersSection from "@/sections/Pioneer/pioneer";
// import InvestorSection from "@/sections/Patron/Investors";
import Nav from "@/components/Nav/nav";
// import Fitarth from "@/components/CommunityServices/fitronx-Card";
import VisionMissionCards from "@/components/visionmissioncards";
import Image from "next/image";
  import { ToastContainer } from 'react-toastify';

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use sessionStorage instead of localStorage
    // This will persist only for the current browsing session
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro") === "true";
    setIntroComplete(hasSeenIntro);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleIntroComplete = () => {
    setIntroComplete(true);
    // Save to sessionStorage instead of localStorage
    sessionStorage.setItem("hasSeenIntro", "true");
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <main
        ref={containerRef}
        className="relative min-h-screen bg-gradient-to-b from-black to-gray-900 dark:from-black dark:to-gray-900 text-white overflow-hidden"
      >
        <CustomCursor
          containerRef={containerRef as React.RefObject<HTMLDivElement>}
        />
        <ScrollProgress scrollYProgress={scrollYProgress} />
        {/* <NoiseTexture /> */}
        <ParticlesBackground />
        {/* <VerticalMenuIndicator /> */}

        {!introComplete ? (
          <IntroAnimation onComplete={handleIntroComplete} />
        ) : (
          <>
            <Navbar scrolled={scrolled} />
            <Nav />
            <HeroSection />
            <About />

          <VisionMissionCards/>

            {/* <Fitarth /> */}
            <MarqueeText />
            {/* <FeaturesSection /> */}
            {/* <ChatbotServices />
            <InvestorSection />
            <TeamMembersSection />  */}
            {/* <FaqSection />  */}
            <Footer />
            <FloatingChatbot />
            <ToastContainer />
          </>
        )}
      </main>
    </ThemeProvider>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Logo } from "@/components/NavBar/NavLogo";
import { HamburgerButton } from "@/components/NavBar/HamburgerButton";
import { MobileMenu } from "@/components/NavBar/MobileMenu";
import Signup from '@/components/Auth/signup';
// import {
//   SignInButton,
//   SignUpButton,
//   SignedIn,
//   SignedOut,
//   UserButton,
// } from "@clerk/nextjs";

// Constants
export const NAV_ITEMS = [
  { href: "home", label: "Home" },
  { href: "Features", label: "Features" },
  { href: "Services", label: "Services" },
  { href: "Pioneers", label: "Pioneers" },
  // { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

// Animation variants
export const ANIMATIONS = {
  circle: {
    open: {
      strokeDashoffset: 0,
      transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
    },
    closed: {
      strokeDashoffset: 100,
      transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
    },
  },
  menu: {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.76, 0, 0.24, 1],
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
    closed: {
      x: "-100%",
      opacity: 0.3,
      transition: {
        duration: 0.6,
        ease: [0.76, 0, 0.24, 1],
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  },
  item: {
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
    closed: {
      x: -50,
      opacity: 0,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
  },
};

// Component types
export interface NavbarProps {
  scrolled: boolean;
}

export default function Navbar({ scrolled }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);

  // Close menu when resizing to desktop (hide navbar completely)
  useEffect(() => {
    if (!isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Only render on mobile devices
  if (!isMobile) {
    return null;
  }

  return (
    <div ref={containerRef}>
      <motion.nav
        style={{ opacity }}
        className={`fixed top-0 left-0 right-0 z-50 px-4 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-black/80 backdrop-blur-lg border-b border-white/10"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <Logo />

            <div className="flex items-center gap-3">
              {/* Mobile Auth Buttons */}
              {/* <SignedOut>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="bg-black text-white hover:bg-gray-800 text-sm px-3 py-2">
                    
                    
                  </div>
                </motion.div>
              </SignedOut> */}
              

              {/* <SignedIn>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UserButton 
                    showName={false}
                    appearance={{
                      elements: {
                        userButtonBox: "text-white",
                        userButtonText: "text-white",
                        userButtonOuterIdentifier: "text-white",
                        userButtonTrigger: "text-white"
                      }
                    }}
                  />
                </motion.div>
              </SignedIn> */}

              {/* Hamburger Menu Button */}
              <HamburgerButton isOpen={isOpen} toggleMenu={toggleMenu} />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Menu */}
      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
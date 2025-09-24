"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SquareArrowOutDownLeft } from "lucide-react";

import ParticlesBackground from "@/components/shared/particle-background";
import CustomCursor from "@/components/shared/custom-cursor";
import BackButton from "@/components/Auth/BackButton";


import "@/styles/responsive.css";

const services = [
  {
    id: 1,
    title: "VirzeonX",
    description:
      "Powerful platform with cutting-edge solutions designed to simplify your workflow and boost productivity.",
    link: "/VirzeonX",
    image: "https://res.cloudinary.com/dnfq7ty1x/image/upload/v1757929622/virzeonX-removebg-preview_mrxv3t.png",
  },
  {
    id: 2,
    title: "MedhaCare",
    description:
      "Smart healthcare service ensuring seamless patient management, faster diagnostics, and better accessibility.",
    link: "/MedhaCare",
    image: "https://res.cloudinary.com/dnfq7ty1x/image/upload/v1757929627/medhacare-removebg-preview_ww3r5y.png",
  },
];

const Page = () => {
  const containerRef = useRef(null);

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col items-center justify-center overflow-hidden">
      {/* Background Particles */}
      <ParticlesBackground />

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <BackButton />
      </div>

      {/* Custom Cursor */}
      <CustomCursor containerRef={containerRef} />

      {/* Main Content */}
      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-6xl px-4 lg:px-12 flex flex-col items-center"
      >
        {/* Cards Section */}
        <div className="service-card-wrapper row flex flex-wrap justify-center gap-8 mt-16">
          {services.map((service) => (
            <Link
              key={service.id}
              href={service.link}
              className="group col-lg-6 col-md-12 w-full md:w-[45%]"
            >
              <div className="p-8 pt-20 relative rounded-2xl shadow-lg bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-all duration-500 ease-in-out overflow-hidden">
                {/* Decorative BG Logo */}
                <img
                  className="absolute opacity-10 group-hover:opacity-50 transition-opacity duration-500 ease-in-out w-40 bottom-[55%] scale-[2] right-[-1rem] pointer-events-none"
                  src={service.image}
                  alt="Background Logo"
                />

                {/* Service Number */}
                <h2 className="text-4xl font-bold text-gray-400 group-hover:text-white transition-colors duration-500">
                  {String(service.id).padStart(2, "0")}
                </h2>

                {/* Description */}
                <p className="mt-4 text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-500 leading-relaxed">
                  {service.description}
                </p>

                {/* Footer */}
                <div className="flex justify-between items-center mt-8">
                  <h1 className="text-2xl font-semibold group-hover:text-white transition-colors duration-500">
                    {service.title}
                  </h1>
                  <SquareArrowOutDownLeft
                    size={28}
                    className="text-gray-400 group-hover:text-white transition-colors duration-500"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Paragraph */}
        <div className="service-para text-gray-400 text-center max-w-3xl mt-12 px-4 leading-relaxed">
          Our mission is to build impactful digital products that empower
          individuals and organizations to work smarter, live healthier, and
          achieve more with technology.
        </div>
      </div>
    </div>
  );
};

export default Page;

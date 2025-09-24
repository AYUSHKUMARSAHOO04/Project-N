"use client";
import React, { useRef } from "react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ParticlesBackground from "@/components/shared/particle-background";
import CustomCursor from "@/components/shared/custom-cursor";
import BackButton from "@/components/Auth/BackButton";
import "@/styles/responsive.css";
import { HeartPulse } from "lucide-react";
import path from "path";
import Link from "next/link";

const page = () => {
  const containerRef = useRef(null);

  const virzeonXServiceData = [
    {
      id: 1,
      title: "FitronX",
      description:
        "AI-driven fitness and wellness platform offering personalized workout plans and health tracking.",
      path: "/fitronx",
      url: "https://res.cloudinary.com/dnfq7ty1x/image/upload/v1757926604/FitronX_ty8omf.webp",
    },
    {
      id: 2,
      title: "Wellip",
      description:
        "AI-driven fitness and wellness platform offering personalized workout plans and health tracking.",
      path: "/wellip",
      url: "https://res.cloudinary.com/dnfq7ty1x/image/upload/v1756118529/Wellip__kfqux2.png",
    },
    {
      id: 3,
      title: "HealthMate",
      description:
        "AI-driven fitness and wellness platform offering personalized workout plans and health tracking.",
      path: "/HealthMateLanding",
      url: "https://res.cloudinary.com/dnfq7ty1x/image/upload/v1757926656/telehealth-consultation_uylybn.webp",
    },
    {
      id: 4,
      title: "GoldenCare",
      description:
        "AI-driven fitness and wellness platform offering personalized workout plans and health tracking.",
      path: "/goldencare",
      url: "https://res.cloudinary.com/dnfq7ty1x/image/upload/v1757926657/service-goldencare-pic_l4i5oq.webp",
    },
    {
      id: 5,
      title: "MindEase",
      description:
        "AI-driven fitness and wellness platform offering personalized workout plans and health tracking.",
      path: "/mindease",
      url : "https://res.cloudinary.com/dnfq7ty1x/image/upload/v1757926656/girl-sitting-pose_yvyaxi.webp",
    },
    {
      id: 6,
      title: "PetAI",
      description:
        "AI-driven fitness and wellness platform offering personalized workout plans and health tracking.",
      path: "/pet-ai",
      url: "https://res.cloudinary.com/dnfq7ty1x/image/upload/v1757926657/petai_l3rvpm.webp",
    },
  ];
  return (
    <div className="p-[3rem] pt-[9rem] items-center min-h-[100vh] w-full">
      <ParticlesBackground />
      <BackButton />
      <CustomCursor containerRef={containerRef} />
      <div className="main-container">
        <div className="row">
          <div className="flex flex-col mb-[5rem] col-lg-6 col-md-12">
            <div className="p-[0.5rem] px-[1rem] w-fit rounded-[2rem] border-[1px] border-solid border-gray-400 text-gray-400 text-[0.8rem]">
              VIRZEONX SERVICES
            </div>

            <div className="py-[2rem] text-[2rem] font-[500]">
              <h1>Explore our cutting-edge</h1>
              <h1 className="text-gradient bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                AI-powered healthcare solutions
              </h1>
            </div>

            <p className="w-[75%] leading-5 text-gray-400 text-[0.9rem]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
              ducimus ratione omnis quis magnam vero nostrum atque explicabo
              suscipit saepe maxime doloribus dicta nobis tempora incidunt et
              iste, sequi numquam?
            </p>
          </div>

          <div className="flex flex-col max-h-[75vh] lg:overflow-auto col-lg-6 col-md-12" suppressHydrationWarning>
            <div className="row">
              {virzeonXServiceData.map((service) => (
                <div key={service.id} className="col-lg-6 col-md-6 col-sm-12 pr-[1rem] pb-[2rem]">
                  <Link href={service.path} >
                    <div className="relative group flex flex-col overflow-hidden rounded-xl shadow-lg bg-gray-100/5 text-white backdrop-blur-sm transition-colors duration-500 ease-in-out">
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out z-0"></div>

                      {/* Image Section */}
                      <div className="relative z-10">
                        <img
                          className="w-full h-40 object-cover"
                          src={service.url}
                          alt="Image"
                        />
                      </div>

                      {/* Content Section */}
                      <div className="relative z-10 px-[2rem] py-[1.5rem]">
                        <h1 className="text-[1.3rem] mb-[1rem] font-[500]">
                          {service.title}
                        </h1>
                        <p className="text-[0.8rem] text-gray-200 group-hover:text-black transition-colors duration-500 ease-in-out">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Gamepad2,
  Music2,
  Flame,
  UserCheck,
  Languages,
  Clock,
  Star,
} from "lucide-react";
import Link from "next/link";

// Custom CSS for cursor visibility
const cursorStyle = {
  cursor: "auto !important",
};

// Style for consistent particle background
const particleBackgroundStyle = {
  position: "absolute",
  inset: 0,
  zIndex: 0,
  opacity: 0.3,
  pointerEvents: "none", // Ensure clicks pass through to elements below
};

const learningPaths = [
  {
    title: "Beginner Wellness Seeker",
    description:
      "Start your journey towards holistic well-being. Access personalized tips, video lessons, and playful exercises designed for newcomers.",
    icon: Flame,
    color: "from-orange-600 to-orange-900",
    bgColor: "bg-black/30",
    borderColor: "border-white/10",
  },
  {
    title: "Mental Health Warrior",
    description:
      "Build resilience and support your mind. Learn techniques, track progress, and get guided meditations for stress management.",
    icon: Star,
    color: "from-indigo-600 to-indigo-900",
    bgColor: "bg-black/30",
    borderColor: "border-white/10",
  },
  {
    title: "Kala Explorer",
    description:
      "Engage your artistic soul! Explore creative challenges, music, and expressive activities for enhanced happiness.",
    icon: Music2,
    color: "from-teal-600 to-teal-900",
    bgColor: "bg-black/30",
    borderColor: "border-white/10",
  },
  {
    title: "Neet Wellness Companion",
    description:
      "A supportive digital friend that keeps you motivated daily. Unlock wellness streaks, XP, and personalized encouragement.",
    icon: UserCheck,
    color: "from-blue-600 to-blue-900",
    bgColor: "bg-black/30",
    borderColor: "border-white/10",
  },
];

const features = [
  {
    title: "Video Modules",
    description: "Curated wellness videos by experts for every stage and topic.",
    icon: Video,
    color: "bg-blue-500",
  },
  {
    title: "Microgames",
    description: "Mini-games that make building healthy habits fun and engaging.",
    icon: Gamepad2,
    color: "bg-purple-500",
  },
  {
    title: "ASMR",
    description: "Relaxing soundscapes and ASMR sessions to soothe your senses.",
    icon: Music2,
    color: "bg-green-500",
  },
  {
    title: "Streaks & XP",
    description: "Stay motivated—earn streaks, badges, and XP points on your journey.",
    icon: Flame,
    color: "bg-orange-500",
  },
];

const onboardingSteps = [
  {
    title: "Login",
    description: "Sign in or create your Wellip account for a personalized experience.",
    icon: UserCheck,
    color: "bg-blue-500",
  },
  {
    title: "Language",
    description: "Choose your preferred language for all guidance and interactions.",
    icon: Languages,
    color: "bg-emerald-500",
  },
  {
    title: "Age",
    description: "Select your age group to receive age-appropriate resources.",
    icon: Clock,
    color: "bg-purple-500",
  },
];

const faqs = [
  {
    question: "What makes Wellip unique?",
    answer:
      "Wellip uses interactive videos, games, and creative exercises uniquely tailored to your wellness stage, making growth enjoyable and sustainable.",
  },
  {
    question: "Can I switch between learning paths?",
    answer:
      "Absolutely! You can explore any learning path based on your current interest or goal. Your progress will be saved.",
  },
  {
    question: "How do I earn XP and streaks?",
    answer:
      "Participate daily—watch videos, play microgames, or relax with ASMR. Consistency is rewarded with XP and streak multipliers.",
  },
  {
    question: "Is my data private?",
    answer:
      "Yes, your wellness data is securely stored and never shared without your approval.",
  },
];

const WellipLandingPage = () => {
  const [activeOnboardingStep, setActiveOnboardingStep] = useState(0);

  return (
    <div className="min-h-screen bg-black" style={cursorStyle}>
      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-br from-black via-gray-900 to-black py-20"
        style={cursorStyle}
      >
        <div style={particleBackgroundStyle}>
          <div className="noise"></div>
        </div>
        <div
          className="container mx-auto px-4 relative z-10"
          style={cursorStyle}
        >
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                <span className="text-emerald-400">Wellip</span>
              </h1>
              <h2 className="text-2xl md:text-3xl text-gray-300 mb-6">
                NirveonX Omnicare
              </h2>
              <p className="text-xl text-gray-300 mb-4 font-medium">
                Discover a playful approach to wellness and mental health.
              </p>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                India's most engaging wellness companion—interactive guidance,
                creative challenges, and progress rewards for every step of your life journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg backdrop-blur-sm border border-white/10"
                >
                  Start My Wellness Journey
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-lg text-lg font-semibold transition-colors backdrop-blur-sm"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section
        className="py-20 bg-gray-900/50 backdrop-blur-sm relative"
        style={cursorStyle}
      >
        <div style={particleBackgroundStyle}>
          <div className="noise"></div>
        </div>
        <div
          className="container mx-auto px-4 relative z-10"
          style={cursorStyle}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Learning Path
            </h2>
            <p className="text-xl text-gray-300">
              Find a path that fits your wellness goals
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {learningPaths.map((path, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 20px rgba(255,255,255,0.1)",
                }}
                className={`${path.bgColor} ${path.borderColor} border backdrop-blur-md rounded-xl p-6 text-center transition-all duration-300 glass`}
              >
                <div
                  className={`inline-flex p-4 rounded-full bg-gradient-to-r ${path.color} text-white mb-4`}
                >
                  <path.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {path.title}
                </h3>
                <p className="text-gray-300">{path.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black relative" style={cursorStyle}>
        <div style={particleBackgroundStyle}>
          <div className="noise"></div>
        </div>
        <div
          className="container mx-auto px-4 relative z-10"
          style={cursorStyle}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Features for Growth & Fun
            </h2>
            <p className="text-xl text-gray-300">
              Wellness tools to learn, play, and relax
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(255,255,255,0.12)",
                }}
                className="bg-black/40 backdrop-blur-md rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10 text-center"
              >
                <div
                  className={`inline-flex p-4 rounded-full ${feature.color} text-white mb-6`}
                >
                  <feature.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding */}
      <section className="py-20 bg-gray-900/30 backdrop-blur-sm relative" style={cursorStyle}>
        <div style={particleBackgroundStyle}><div className="noise"></div></div>
        <div className="container mx-auto px-4 relative z-10" style={cursorStyle}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple Onboarding
            </h2>
            <p className="text-xl text-gray-300">
              Get started in just a few steps
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {onboardingSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`text-center cursor-pointer p-4 rounded-lg transition-all duration-300 ${activeOnboardingStep === index ? "bg-emerald-900/40 border border-emerald-500/30 backdrop-blur-sm" : "hover:bg-gray-800/50 border border-transparent"}`}
                  onClick={() => setActiveOnboardingStep(index)}
                >
                  <div className={`inline-flex p-3 rounded-full ${step.color} text-white mb-3`}>
                    <step.icon size={28} />
                  </div>
                  <div className="text-lg font-semibold text-white mb-1">{step.title}</div>
                  <div className="text-xs text-gray-400">{step.description}</div>
                </motion.div>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeOnboardingStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-black/40 backdrop-blur-md rounded-xl p-8 shadow-lg border border-white/10 text-center"
              >
                <div
                  className={`inline-flex p-4 rounded-full ${onboardingSteps[activeOnboardingStep].color} text-white mb-4`}
                >
                  {(() => {
                    const IconComp = onboardingSteps[activeOnboardingStep].icon;
                    return <IconComp size={32} />;
                  })()}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {onboardingSteps[activeOnboardingStep].title}
                </h3>
                <p className="text-lg text-gray-300">
                  {onboardingSteps[activeOnboardingStep].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-black relative" style={cursorStyle}>
        <div style={particleBackgroundStyle}><div className="noise"></div></div>
        <div className="container mx-auto px-4 relative z-10" style={cursorStyle}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-300">
              Answering your Wellip queries
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ scale: 1.01, borderColor: "rgba(255,255,255,0.18)" }}
                className="bg-black/40 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10"
              >
                <h3 className="text-lg font-semibold text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-300">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="py-20 bg-gradient-to-r from-emerald-900/70 to-blue-800/70 backdrop-blur-md relative"
        style={cursorStyle}
      >
        <div style={particleBackgroundStyle}><div className="noise"></div></div>
        <div className="container mx-auto px-4 text-center relative z-10" style={cursorStyle}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Wellness Journey?
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              Join Wellip and discover a new way to nurture your mind and body
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-emerald-900 hover:bg-gray-200 px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
              >
                Start My Wellness Journey
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-white text-white hover:bg-emerald-800/50 px-8 py-4 rounded-lg text-lg font-semibold transition-colors backdrop-blur-sm"
              >
                Contact Support
              </motion.button>
            </div>
            <div className="mt-8 text-emerald-100 text-sm">
              <p>
                Questions? Contact us at{" "}
                <a
                  href="mailto:wellip@nirveonx.com"
                  className="underline hover:text-white"
                >
                  wellip@nirveonx.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="bg-black text-white py-12 border-t border-white/10"
        style={cursorStyle}
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">NirveonX Omnicare</h3>
              <p className="text-gray-400">
                Empowering wellness journeys with innovative digital tools and playful experiences.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/HealthMateLanding"
                    className="hover:text-white transition-colors"
                  >
                    HealthMate
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mindease"
                    className="hover:text-white transition-colors"
                  >
                    MindEase
                  </Link>
                </li>
                <li>
                  <Link
                    href="/goldencare"
                    className="hover:text-white transition-colors"
                  >
                    GoldenCare
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pet-ai"
                    className="hover:text-white transition-colors"
                  >
                    PetAI
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/forum"
                    className="hover:text-white transition-colors"
                  >
                    CuraForgeX
                  </Link>
                </li>
                <li>
                  <Link
                    href="/team"
                    className="hover:text-white transition-colors"
                  >
                    Our Team
                  </Link>
                </li>
                <li>
                  <Link
                    href="/Pioneers"
                    className="hover:text-white transition-colors"
                  >
                    Leadership
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="mailto:support@nirveonx.com"
                    className="hover:text-white transition-colors"
                  >
                    Contact Support
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+919491689462"
                    className="hover:text-white transition-colors"
                  >
                    +91 94916 89462
                  </a>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 NirveonX. All rights reserved. | Empowering Wellness by Design
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WellipLandingPage;

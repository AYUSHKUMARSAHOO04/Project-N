"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  UserCheck,
  Star,
  MapPin,
  FileText,
  Phone,
  Shield,
  AlertCircle,
  Ambulance,
  HeartPulse
} from "lucide-react";
import Link from "next/link";

// Inline style to ensure the default mouse pointer is shown
const cursorStyle = {
  cursor: "auto",
};

// Emergency modules shown as feature cards in the first section
const emergencyModules = [
  {
    title: "SOS Emergency",
    description: "Trigger instant SOS alerts to nearest ambulance & hospital.",
    icon: Flame,
    color: "from-red-500 to-red-700",
  },
  {
    title: "Live Tracking",
    description: "Track ambulance location and ETA in real-time.",
    icon: MapPin,
    color: "from-blue-500 to-blue-700",
  },
  {
    title: "Hospital Connect",
    description: "Direct connection to nearest emergency hospitals.",
    icon: HeartPulse,
    color: "from-green-500 to-green-700",
  },
  {
    title: "Emergency Contacts",
    description: "Quick dial to saved family & doctors.",
    icon: Phone,
    color: "from-purple-500 to-purple-700",
  },
];

// Core features of AmboRapid (displayed in the second section)
const features = [
  {
    title: "SOS Button",
    description: "One-tap SOS alert to nearest ambulance and hospital.",
    icon: AlertCircle,
    color: "text-red-500",
  },
  {
    title: "Real-Time Tracking",
    description: "See your ambulance moving live on the map with ETA.",
    icon: MapPin,
    color: "text-blue-500",
  },
  {
    title: "AI Support",
    description: "Preliminary AI-based guidance while ambulance arrives.",
    icon: Star,
    color: "text-purple-500",
  },
  {
    title: "Cross-Service Sync",
    description: "Integrated with NirveonX Omnicare ecosystem.",
    icon: Shield,
    color: "text-green-500",
  },
];

// Steps for onboarding new users (displayed in onboarding section)
const onboardingSteps = [
  {
    title: "Login",
    description: "Sign in with NirveonX SSO for secure access.",
    icon: UserCheck,
    color: "bg-blue-500",
  },
  {
    title: "Location Access",
    description: "Enable GPS for accurate ambulance dispatch.",
    icon: MapPin,
    color: "bg-red-500",
  },
  {
    title: "Emergency Profile",
    description: "Add your medical info & emergency contacts.",
    icon: FileText,
    color: "bg-purple-500",
  },
];

// Frequently Asked Questions (displayed at the bottom)
const faqs = [
  {
    question: "How does AmboRapid help in emergencies?",
    answer: "AmboRapid connects you instantly to nearby ambulances, provides live tracking, and alerts hospitals in real time.",
  },
  {
    question: "Can I add emergency contacts?",
    answer: "Yes, you can save family, friends, and doctors for one-tap calling during SOS.",
  },
  {
    question: "Is my location shared?",
    answer: "Your live location is shared only with authorized ambulance & hospital staff during emergencies.",
  },
  {
    question: "Does it work across India?",
    answer: "Yes, AmboRapid integrates with NirveonX partner networks across India for wide coverage.",
  },
];

// Main landing page component for AmboRapid
const AmboRapidLandingPage = () => {
  // State to track which onboarding step is active
  const [activeOnboardingStep, setActiveOnboardingStep] = useState(0);
  const [activeTab, setActiveTab] = useState("features");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800" style={cursorStyle}>
      {/* ================= Header/Navigation ================= */}
      <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-700 p-2 rounded-lg">
              {/* <Ambulance className="text-white" size={28} /> */}
            </div>
            <span className="text-2xl font-bold text-blue-200">Ambo<span className="text-red-400">Rapid</span></span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-300 hover:text-blue-400 font-medium">Features</a>
            <a href="#faqs" className="text-gray-300 hover:text-blue-400 font-medium">FAQs</a>
            <a href="#contact" className="text-gray-300 hover:text-blue-400 font-medium">Contact</a>
          </nav>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold transition-colors shadow-lg"
          >
            Emergency SOS
          </motion.button>
        </div>
      </header>

      {/* ================= Hero Section ================= */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-blue-900 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-red-900 rounded-full opacity-40 blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-100 mb-6">
                <span className="text-white">Ambo</span>
                <span className="text-red-500">Rapid</span>
                <br />
                Emergency <span className="text-red-500">Ambulance</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                Get immediate medical help with SOS alerts, real-time ambulance tracking,
                and seamless hospital integration across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg flex items-center justify-center"
                >
                  <AlertCircle className="mr-2" size={24} />
                  Request Emergency Help
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-blue-400 text-blue-200 hover:bg-blue-900 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                >
                  Learn More
                </motion.button>
              </div>

              {/* Emergency stats below buttons */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-800"
                >
                  <div className="text-2xl font-bold text-red-400">24/7</div>
                  <div className="text-gray-300">Emergency Support</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-800"
                >
                  <div className="text-2xl font-bold text-blue-400">8 min</div>
                  <div className="text-gray-300">Avg. Response Time</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-800"
                >
                  <div className="text-2xl font-bold text-green-400">200+</div>
                  <div className="text-gray-300">Cities Covered</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= Emergency Modules Section ================= */}
      <section id="features" className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              Emergency Response <span className="text-red-400">Features</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Tools designed to save lives in critical moments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {emergencyModules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-md border border-gray-800 transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${module.color.replace('white', 'gray-900').replace('gray-50', 'gray-800')} text-white mb-4`}>
                  <module.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-3">
                  {module.title}
                </h3>
                <p className="text-gray-400">{module.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Core Features Section ================= */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
                How <span className="text-blue-400">AmboRapid</span> Works
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                Our seamless emergency response system ensures you get help when you need it most, with just a few taps on your phone.
              </p>

              <div className="flex border-b border-gray-800 mb-6">
                <button
                  className={`px-4 py-2 font-medium ${activeTab === "features" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400"}`}
                  onClick={() => setActiveTab("features")}
                >
                  Features
                </button>
                <button
                  className={`px-4 py-2 font-medium ${activeTab === "onboarding" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400"}`}
                  onClick={() => setActiveTab("onboarding")}
                >
                  Setup
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "features" ? (
                  <motion.div
                    key="features"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <div className={`p-2 rounded-lg ${feature.color} bg-opacity-20 mr-4`}>
                          <feature.icon className={feature.color} size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-100 mb-1">{feature.title}</h3>
                          <p className="text-gray-400">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="onboarding"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    {onboardingSteps.map((step, index) => (
                      <div key={index} className="flex items-start">
                        <div className="bg-blue-900 text-blue-200 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-100 mb-1">{step.title}</h3>
                          <p className="text-gray-400">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="md:w-1/2 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-950 p-8 rounded-2xl shadow-lg border border-gray-800 max-w-md"
              >
                <div className="text-center mb-6">
                  <div className="bg-red-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="text-red-400" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-100 mb-2">Emergency SOS</h3>
                  <p className="text-gray-400">One tap to get immediate help</p>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg mb-6 border border-gray-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-200">Your Location</span>
                    <span className="text-blue-400 text-sm">Detected</span>
                  </div>
                  <div className="text-sm text-gray-400">123 Main St, City, State</div>
                </div>

                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-semibold text-lg shadow-lg transition-colors">
                  Activate Emergency Mode
                </button>

                <div className="mt-4 text-center text-sm text-gray-500">
                  This will alert nearby ambulances and emergency contacts
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>



      {/* ================= FAQs Section ================= */}
      <section id="faqs" className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need to know about AmboRapid
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="mb-6 last:mb-0"
              >
                <div className="bg-gray-900 rounded-lg p-6 shadow-sm border border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-100 mb-3 flex items-start">
                    <span className="bg-blue-900 text-blue-200 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">?</span>
                    {faq.question}
                  </h3>
                  <p className="text-gray-400 pl-9">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Final CTA Section ================= */}
      <section id="contact" className="py-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Need Emergency Assistance Now?
            </h2>
            <p className="text-xl text-blue-200 mb-8">
              Use AmboRapid to get real-time ambulance response and hospital care
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-600 text-white hover:bg-red-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg flex items-center justify-center"
              >
                <AlertCircle className="mr-2" size={24} />
                Request Ambulance Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-white text-white hover:bg-blue-900 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                Contact Support
              </motion.button>
            </div>
            <div className="mt-8 text-blue-200 text-sm">
              <p>
                Questions? Contact us at{" "}
                <a
                  href="mailto:amborapid@nirveonx.com"
                  className="underline hover:text-white"
                >
                  amborapid@nirveonx.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= Footer Section ================= */}
      <footer className="bg-gray-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Ambulance className="text-blue-400" size={24} />
                <span className="text-xl font-bold text-blue-200">Ambo<span className="text-red-400">Rapid</span></span>
              </div>
              <p className="text-gray-400">
                Enabling fast and reliable emergency medical response with cutting-edge technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/HealthMateLanding"
                    className="hover:text-blue-200 transition-colors"
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
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-blue-200 transition-colors"
                  >
                    About Us
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
                    href="/careers"
                    className="hover:text-white transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="mailto:support@nirveonx.com"
                    className="hover:text-blue-200 transition-colors"
                  >
                    Contact Support
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+919491689462"
                    className="hover:text-blue-200 transition-colors"
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
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>
              &copy; 2025 NirveonX. All rights reserved. | Empowering Wellness by Design
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AmboRapidLandingPage;
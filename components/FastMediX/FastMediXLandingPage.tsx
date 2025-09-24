
 "use client";
import { motion } from "framer-motion";
import React, { useState } from "react";
import {
  Package,
  Truck,
  Stethoscope,
  ShieldCheck,
  Users,
  Clock,
  HeartPulse,
  Languages,
  MapPin,
  Ambulance,
  Bell,
} from "lucide-react";

import Link from "next/link";

const cursorStyle = {
  cursor: "auto !important",
};

// Updated Services
const services = [
  {
    title: "Doctor Consultation",
    description:
      "Book virtual consultations with certified doctors for convenient healthcare access.",
    icon: Stethoscope,
    gradient: "from-emerald-600 to-teal-800",
  },
  {
    title: "Medicine Delivery",
    description:
      "Order medicines online and get them delivered safely and quickly to your doorstep.",
    icon: Package,
    gradient: "from-blue-600 to-cyan-800",
  },
  {
    title: "Lab Tests & Diagnostics",
    description:
      "Schedule lab tests and diagnostics with home sample collection and digital reports.",
    icon: HeartPulse,
    gradient: "from-purple-600 to-indigo-800",
  },
  {
    title: "Emergency & Ambulance",
    description:
      "Quick ambulance booking and emergency medical assistance when you need it most.",
    icon: Ambulance,
    gradient: "from-red-600 to-pink-800",
  },
  {
    title: "Onboarding Assistance",
    description:
      "Seamless onboarding with easy login, profile setup, and prescription upload.",
    icon: Users,
    gradient: "from-orange-500 to-yellow-700",
  },
  {
    title: "Reminders & Alerts",
    description:
      "Get reminders for medicines, appointments, and health checkups on time.",
    icon: Bell,
    gradient: "from-teal-500 to-green-700",
  },
];

// Features
const features = [
  {
    title: "Fast Delivery",
    description: "Timely doorstep delivery across major cities in India.",
    icon: Truck,
    color: "bg-blue-500",
  },
  {
    title: "Secure Services",
    description: "Safe, private, and reliable healthcare for every user.",
    icon: ShieldCheck,
    color: "bg-emerald-500",
  },
  {
    title: "24/7 Support",
    description: "Our healthcare experts are always ready to assist you.",
    icon: Users,
    color: "bg-purple-500",
  },
  {
    title: "Refill Reminders",
    description: "Never miss a dose—get notified when it’s time to restock.",
    icon: Clock,
    color: "bg-orange-500",
  },
];

// Onboarding Steps
const onboardingSteps = [
  { title: "Login", icon: Users },
  { title: "Choose Language", icon: Languages },
  { title: "Profile Setup", icon: MapPin },
  { title: "Upload Prescription", icon: Package },
  { title: "Get Medicines", icon: Truck },
];

const FastMediXLandingPage = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div>
      {/* Hero */}
      <section
        className="relative bg-cover bg-center bg-no-repeat py-20"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dyzpbubpy/image/upload/v1757920919/34079365_uj59kr.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Fast<span className="text-cyan-400">MediX</span>
          </motion.h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-8">
            Your trusted digital healthcare companion – medicines, doctors,
            diagnostics, and emergency care at your fingertips.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-lg font-semibold shadow-lg"
          >
            Get Started
          </motion.button>
        </div>
      </section>

      {/* Services */}
      <section className="relative py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Our Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-black/40 p-6 rounded-2xl border border-white/10 text-center"
              >
                <div
                  className={`mx-auto mb-4 p-6 rounded-full bg-gradient-to-r ${s.gradient} text-white w-fit`}
                >
                  <s.icon size={40} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-gray-300">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        className="relative py-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/healthcare-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="relative container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Why Choose FastMediX?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((f, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="flex items-start gap-4 bg-black/50 p-6 rounded-xl border border-white/10"
              >
                <div className={`${f.color} p-3 rounded-full text-white`}>
                  <f.icon size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{f.title}</h3>
                  <p className="text-gray-300">{f.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding */}
      <section className="relative py-20 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-12">
            Onboarding Journey
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {onboardingSteps.map((step, index) => (
              <div
                key={index}
                onClick={() => setActiveStep(index)}
                className={`flex flex-col items-center cursor-pointer ${
                  activeStep === index ? "text-cyan-400" : "text-gray-400"
                }`}
              >
                <div
                  className={`p-4 rounded-full border-2 ${
                    activeStep === index
                      ? "border-cyan-400 bg-cyan-900/30"
                      : "border-gray-600"
                  }`}
                >
                  <step.icon size={28} />
                </div>
                <p className="mt-2 font-medium">{step.title}</p>
              </div>
            ))}
          </div>
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
              <h3 className="text-xl font-bold mb-4">FastMediX</h3>
              <p className="text-gray-400">
                Empowering wellness with trusted digital healthcare and
                innovative solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="hover:text-white transition-colors"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="mailto:support@fastmedix.com"
                    className="hover:text-white transition-colors"
                  >
                    support@fastmedix.com
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
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
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
            <p>&copy; 2025 FastMediX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FastMediXLandingPage;
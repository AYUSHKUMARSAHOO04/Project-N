"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Users,
  Stethoscope,
  Brain,
  Video,
  Phone,
  MessageCircle,
  MessageSquare,
  ChevronRight,
  Shield,
  Award,
  Clock,
  UserCheck,
  FileText,
  CheckCircle,
  Star,
  Globe,
  Lock,
  Zap,
} from "lucide-react";
import Link from "next/link";

// Custom CSS for cursor visibility
const cursorStyle = {
  cursor: "auto !important",
};

// Style for consistent particle background
const particleBackgroundStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: 0,
  opacity: 0.3,
  pointerEvents: "none", // Ensure clicks pass through to elements below
};

const DoctorForumLanding = () => {
  const [activeOnboardingStep, setActiveOnboardingStep] = useState(0);

  // Force cursor visibility on component mount
  useEffect(() => {
    // Add cursor visibility class to body
    document.body.style.cursor = "auto";

    // Cleanup on unmount
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  const domains = [
    {
      title: "Healthcare",
      description: "Allopathic, Ayurvedic, and Homeopathic Doctors",
      icon: Heart,
      color: "from-blue-600 to-blue-900",
      bgColor: "bg-black/30",
      borderColor: "border-white/10",
    },
    {
      title: "Elderly Assistance",
      description: "Geriatricians, general physicians, and elder care experts",
      icon: Users,
      color: "from-green-600 to-green-900",
      bgColor: "bg-black/30",
      borderColor: "border-white/10",
    },
    {
      title: "Veterinary",
      description: "Veterinary doctors for animal and pet health",
      icon: Stethoscope,
      color: "from-purple-600 to-purple-900",
      bgColor: "bg-black/30",
      borderColor: "border-white/10",
    },
    {
      title: "Mental Health Assistance",
      description: "Psychologists, psychiatrists, counsellors",
      icon: Brain,
      color: "from-indigo-600 to-indigo-900",
      bgColor: "bg-black/30",
      borderColor: "border-white/10",
    },
  ];

  const features = [
    {
      title: "Separate Communities",
      items: [
        "Healthcare doctors community",
        "Elderly care specialists community",
        "Veterinary doctors community",
        "Mental health professionals community",
      ],
      icon: Users,
      color: "blue",
    },
    {
      title: "Communication Tools",
      items: [
        "Secure high-quality video consultations",
        "Encrypted telephonic consultations",
        "Direct chat interface with patients",
      ],
      icon: Video,
      color: "green",
    },
    {
      title: "Collaborative Forum",
      items: [
        "Cross-domain collaborative forum",
        "Case discussions and treatment opinions",
        "Research and updates sharing",
      ],
      icon: MessageSquare,
      color: "purple",
    },
  ];

  const communicationTools = [
    {
      title: "Video Calling",
      description: "Secure high-quality consultations",
      icon: Video,
      color: "bg-blue-500",
    },
    {
      title: "Audio Calling",
      description: "Encrypted telephonic consultations",
      icon: Phone,
      color: "bg-green-500",
    },
    {
      title: "Chatting",
      description: "Direct chat interface with patients",
      icon: MessageCircle,
      color: "bg-purple-500",
    },
  ];

  const onboardingSteps = [
    {
      step: 1,
      title: "Personal Details Form",
      description: "Name, Age, Gender",
      icon: UserCheck,
      color: "bg-blue-500",
    },
    {
      step: 2,
      title: "Professional Proof Form",
      description: "Educational certificates, Government registration/license",
      icon: Award,
      color: "bg-green-500",
    },
    {
      step: 3,
      title: "Experience Form",
      description: "Years of practice, Previous institutions",
      icon: Clock,
      color: "bg-purple-500",
    },
    {
      step: 4,
      title: "Specialisation Form",
      description: "Primary and sub-specialisation",
      icon: Stethoscope,
      color: "bg-indigo-500",
    },
    {
      step: 5,
      title: "Contact & Verification Form",
      description: "Contact details, Availability schedule",
      icon: FileText,
      color: "bg-pink-500",
    },
  ];

  const benefits = [
    {
      title: "Expanding Patient Base",
      description: "Access to NirveonX's growing digital patient network",
      icon: Users,
    },
    {
      title: "Professional Networking",
      description: "Collaboration with professionals across India and abroad",
      icon: Globe,
    },
    {
      title: "Case Discussions",
      description: "Academic updates and research partnerships",
      icon: FileText,
    },
    {
      title: "Skill Development",
      description: "Exclusive webinars, CMEs, and workshops",
      icon: Award,
    },
  ];

  const trustIndicators = [
    {
      title: "HIPAA Compliant",
      description: "Full compliance with healthcare data protection standards",
      icon: Shield,
    },
    {
      title: "Indian Telemedicine Guidelines",
      description: "Adherent to Government of India telemedicine regulations",
      icon: CheckCircle,
    },
    {
      title: "Secure Platform",
      description: "End-to-end encryption and data security",
      icon: Lock,
    },
  ];

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
                 <span className="text-blue-400">CuraForgeX</span>
              </h1>
              <h2 className="text-2xl md:text-3xl text-gray-300 mb-6">
                NirveonX Omnicare
              </h2>
              <p className="text-xl text-gray-300 mb-4 font-medium">
                Integrated Doctor Community Platform
              </p>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Join India's most comprehensive digital platform connecting
                healthcare professionals across four specialized domains for
                collaborative patient care and professional growth.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg backdrop-blur-sm border border-white/10"
                >
                  Join Community Service
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

      {/* Platform Overview - Four Domains */}
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
              Four Core Domains
            </h2>
            <p className="text-xl text-gray-300">
              Specialized communities for comprehensive healthcare
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {domains.map((domain, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 20px rgba(255,255,255,0.1)",
                }}
                className={`${domain.bgColor} ${domain.borderColor} border backdrop-blur-md rounded-xl p-6 text-center transition-all duration-300 glass`}
              >
                <div
                  className={`inline-flex p-4 rounded-full bg-gradient-to-r ${domain.color} text-white mb-4`}
                >
                  <domain.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {domain.title}
                </h3>
                <p className="text-gray-300">{domain.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Communication Tools */}
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
              Communication Tools
            </h2>
            <p className="text-xl text-gray-300">
              Advanced tools for seamless patient interaction
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {communicationTools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(255,255,255,0.1)",
                }}
                className="bg-black/40 backdrop-blur-md rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
              >
                <div
                  className={`inline-flex p-4 rounded-full ${tool.color} text-white mb-6`}
                >
                  <tool.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {tool.title}
                </h3>
                <p className="text-gray-300 text-lg">{tool.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section
        className="py-20 bg-gray-900/30 backdrop-blur-sm relative"
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
            <h2 className="text-4xl font-bold text-white mb-4">Key Features</h2>
            <p className="text-xl text-gray-300">
              Everything you need for professional healthcare delivery
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-black/40 backdrop-blur-md rounded-xl p-8 shadow-lg border border-white/10"
              >
                <div
                  className={`inline-flex p-4 rounded-full bg-${feature.color}-900/50 text-${feature.color}-400 mb-6`}
                >
                  <feature.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <ul className="space-y-3">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <CheckCircle
                        className="text-green-500 mr-3 mt-0.5 flex-shrink-0"
                        size={20}
                      />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding Process */}
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
              Simple Onboarding Process
            </h2>
            <p className="text-xl text-gray-300">
              Get verified and start practicing in 5 easy steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-5 gap-4 mb-8">
              {onboardingSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`text-center cursor-pointer p-4 rounded-lg transition-all duration-300 ${
                    activeOnboardingStep === index
                      ? "bg-blue-900/30 border border-blue-500/30 backdrop-blur-sm"
                      : "hover:bg-gray-800/50 border border-transparent"
                  }`}
                  onClick={() => setActiveOnboardingStep(index)}
                >
                  <div
                    className={`inline-flex p-3 rounded-full ${step.color} text-white mb-3`}
                  >
                    <step.icon size={24} />
                  </div>
                  <div className="text-sm font-semibold text-white mb-1">
                    Step {step.step}
                  </div>
                  <div className="text-xs text-gray-400">{step.title}</div>
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
                    const IconComponent =
                      onboardingSteps[activeOnboardingStep].icon;
                    return <IconComponent size={32} />;
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

      {/* Benefits Section */}
      <section
        className="py-20 bg-gradient-to-br from-gray-900 to-black relative"
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
              Why Join Our Community?
            </h2>
            <p className="text-xl text-gray-300">
              Unlock opportunities for professional growth and patient care
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(255,255,255,0.1)",
                }}
                className="bg-black/40 backdrop-blur-md rounded-xl p-6 shadow-lg text-center border border-white/10"
              >
                <div className="inline-flex p-4 rounded-full bg-blue-900/50 text-blue-400 mb-4">
                  <benefit.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-300">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust Indicators */}
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
              Security & Trust
            </h2>
            <p className="text-xl text-gray-300">
              Your data and patient information is completely secure
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {trustIndicators.map((indicator, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-black/40 backdrop-blur-md rounded-xl p-8 shadow-lg text-center border border-white/10"
              >
                <div className="inline-flex p-4 rounded-full bg-green-900/50 text-green-400 mb-6">
                  <indicator.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {indicator.title}
                </h3>
                <p className="text-gray-300">{indicator.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className="py-20 bg-gray-900/30 backdrop-blur-sm relative"
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
              What Doctors Say
            </h2>
            <p className="text-xl text-gray-300">
              Trusted by healthcare professionals across India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="bg-black/40 backdrop-blur-md rounded-xl p-8 shadow-lg border border-white/10"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="text-yellow-400 fill-current"
                      size={20}
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">
                  "NirveonX has revolutionized how I connect with patients. The
                  platform is secure, user-friendly, and has significantly
                  expanded my practice reach."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
                    <UserCheck className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      Dr. Sample Doctor
                    </div>
                    <div className="text-gray-400 text-sm">
                      Cardiologist, Mumbai
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-300">
              Common questions from healthcare professionals
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How do I verify my medical credentials?",
                answer:
                  "Our verification process includes submission of educational certificates, medical council registration, and professional licenses. Our team reviews all documents within 24-48 hours.",
              },
              {
                question: "Is the platform compliant with medical regulations?",
                answer:
                  "Yes, we fully comply with Indian Telemedicine Guidelines, HIPAA standards, and maintain the highest levels of data security and patient privacy.",
              },
              {
                question: "What are the consultation fees structure?",
                answer:
                  "Doctors can set their own consultation fees. The platform charges a small service fee only on successful consultations, ensuring you earn fairly for your expertise.",
              },
              {
                question:
                  "Can I collaborate with doctors from other specialties?",
                answer:
                  "Absolutely! Our collaborative forum enables cross-domain discussions, case studies, and professional networking across all four specialized communities.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{
                  scale: 1.01,
                  borderColor: "rgba(255,255,255,0.2)",
                }}
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

      {/* Final CTA Section */}
      <section
        className="py-20 bg-gradient-to-r from-blue-900/70 to-blue-800/70 backdrop-blur-md relative"
        style={cursorStyle}
      >
        <div style={particleBackgroundStyle}>
          <div className="noise"></div>
        </div>
        <div
          className="container mx-auto px-4 text-center relative z-10"
          style={cursorStyle}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Start your journey with India's most comprehensive healthcare
              platform today
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-900 hover:bg-gray-200 px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
              >
                Join Community Service
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-white text-white hover:bg-blue-800/50 px-8 py-4 rounded-lg text-lg font-semibold transition-colors backdrop-blur-sm"
              >
                Contact Support
              </motion.button>
            </div>

            <div className="mt-8 text-blue-100 text-sm">
              <p>
                Questions? Contact us at{" "}
                <a
                  href="mailto:doctors@nirveonx.com"
                  className="underline hover:text-white"
                >
                  doctors@nirveonx.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Integration - Simple Footer for this page */}
      <footer
        className="bg-black text-white py-12 border-t border-white/10"
        style={cursorStyle}
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">NirveonX Omnicare</h3>
              <p className="text-gray-400">
                Revolutionizing healthcare through AI-powered solutions and
                professional collaboration.
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
              &copy; 2025 NirveonX. All rights reserved. | Transforming
              Healthcare with AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DoctorForumLanding;

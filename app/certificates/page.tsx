"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThemeProvider } from "next-themes";
import ParticlesBackground from "@/components/shared/particle-background";
import NoiseTexture from "@/components/shared/noise-texture";
import CustomCursor from "@/components/shared/custom-cursor";
import Link from "next/link";
import { Search, Download, Users, Award, ArrowLeft } from "lucide-react";
import { teamMembers } from "@/contents/team-section";
import { pioneers, additionalPioneer } from "@/contents/pioneer-section";

export default function CertificatesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const allMembers = [
    // ...pioneers.map((p) => ({ ...p, category: "leadership" as const })),
    // ...additionalPioneer.map((p) => ({
    //   ...p,
    //   category: "leadership" as const,
    // })),
    ...teamMembers,
  ];

  // Filter members based on search and category
  const filteredMembers = allMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || member.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <main
        ref={containerRef}
        className="relative min-h-screen bg-gradient-to-b from-black to-gray-900 text-white overflow-hidden"
      >
        <CustomCursor containerRef={containerRef} />
        <NoiseTexture />
        <ParticlesBackground />

        <div className="relative z-10 min-h-screen">
          <div className="flex items-center justify-between p-6 md:p-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-blue-400" />
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Certificates
              </h1>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-12 px-6"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Team Certificates
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Access offer letters, completion certificates, and other important
              documents for our team members, interns, and employees.
            </p>
          </motion.div>

          <div className="px-6 md:px-8 mb-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 backdrop-blur-sm"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white backdrop-blur-sm min-w-[150px]"
                >
                  <option value="all">All Categories</option>
                  <option value="leadership">Leadership</option>
                  <option value="employee">Employee</option>
                  <option value="intern">Intern</option>
                </select>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{filteredMembers.length} members found</span>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="px-6 md:px-8 pb-12"
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMembers.map((member, index) => (
                  <motion.div
                    key={member.id || index}
                    variants={itemVariants}
                    className="group"
                  >
                    <Link
                      href={`/certificates/${encodeURIComponent(
                        member.name.toLowerCase().replace(/\s+/g, "-")
                      )}`}
                    >
                      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 hover:bg-gray-700/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 p-0.5">
                          <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
                            <img
                              src={member.avatar || "/placeholder-avatar.png"}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder-avatar.png";
                              }}
                            />
                          </div>
                        </div>

                        <div className="text-center">
                          <h3 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                            {member.name}
                          </h3>
                          <p className="text-sm text-gray-400 mb-2">
                            {member.role}
                          </p>

                          <div className="flex justify-center">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                member.category === "leadership"
                                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                  : member.category === "employee"
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                  : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                              }`}
                            >
                              {member.category === "leadership"
                                ? "Leadership"
                                : member.category === "employee"
                                ? "Employee"
                                : "Intern"}
                            </span>
                          </div>
                        </div>

                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {filteredMembers.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-gray-400 mb-4">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    No members found
                  </h3>
                  <p className="text-gray-400">
                    Try adjusting your search terms or category filter.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </ThemeProvider>
  );
}

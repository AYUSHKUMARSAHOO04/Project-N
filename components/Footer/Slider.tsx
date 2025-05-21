"use client"; // Make sure this is at the top of your component file

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  MessageSquarePlus,
  Settings,
  LogOut,
  HeartPulse
} from "lucide-react";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter(); // from next/navigation

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    // Add logout logic here if needed (e.g. clear cookies or localStorage
    router.push("/HealthMatesecondLanding"); // Navigate
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className={`fixed z-50 p-2 rounded-full transition-all ${
          isOpen
            ? "left-62 top-6 bg-gray-700/50"
            : "left-6 top-6 bg-indigo-600"
        }`}
      >
        {isOpen ? (
          <X className="text-white w-5 h-5" />
        ) : (
          <Menu className="text-white w-5 h-5" />
        )}
      </button>

      <div
        className={`fixed h-screen w-72 bg-white/10 backdrop-blur-lg border-r border-gray-700/20 flex flex-col z-40 transition-all duration-300 ${
          isOpen ? "left-0" : "-left-full"
        }`}
      >
        <div className="flex flex-row p-6 gap-2 border-b border-gray-700/10">
          <HeartPulse className="text-indigo-600 w-10 h-10" />
          <h1 className="font-semibold text-lg text-white">Healthmate</h1>
        </div>

        <div className="flex-1 flex flex-col justify-between p-4">
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
              <MessageSquarePlus className="w-5 h-5" />
              <span>Start a new chat</span>
            </button>
          </div>

          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;


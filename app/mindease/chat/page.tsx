'use client'
import axios from "axios";
import { useRouter } from "next/navigation";

import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
  CircleArrowLeft,
  LogOut,
  MenuIcon,
  Mic,
  Plus,
  Send,
  Settings,
  Smile,
  Trash2,
  XIcon,
  Link2
} from "lucide-react";
import Link from 'next/link';
import ParticlesBackground from "@/components/shared/particle-background";

// Define message type and chat session types
type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: number;
};

type ChatSession = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
};

export default function MindEasePage() {
  const [user, setUser] = useState(null);
    const [authloading, setAuthLoading] = useState(true);
    const router = useRouter();

    //checking user authentication
  useEffect(() => {
    axios
      .get("http://localhost:8080/auth/user", {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.user);
        setAuthLoading(false);
      })
      .catch(() => {
        setUser(null);
        setAuthLoading(false);
        router.push("/signup");
      });
  }, [router]);
    
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const [input, setInput] = useState('');
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // API URL
  const API_URL = 'https://mindease-api-latest.onrender.com/chat';

  // Get current chat
  const currentChat = chatSessions.find((chat) => chat.id === currentChatId) || null;

  // Load chat sessions from localStorage on initial render
  useEffect(() => {
    const savedSessions = localStorage.getItem("mindease-chat-sessions");
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions);
      setChatSessions(sessions);
      if (sessions.length > 0) {
        setCurrentChatId(sessions[sessions.length - 1].id);
      } else {
        createNewChat();
      }
    } else {
      createNewChat();
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: "New Conversation",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        {
          id: Date.now().toString(),
          text: "Hello. It's nice to meet you. I'm MindEase, a licensed virtual psychiatrist from Nirveon X. I'm here to listen and offer support in a non-judgmental and empathetic space. How are you feeling today? Would you like to talk about something specific that's been on your mind, or is there something else I can help you with?",
          sender: "bot",
          timestamp: Date.now(),
        },
      ],
    };

    setChatSessions((prev) => [...prev, newChat]);
    setCurrentChatId(newChat.id);
    saveSessions([...chatSessions, newChat]);
  };

  const deleteChat = (chatId: string) => {
    const updatedSessions = chatSessions.filter((chat) => chat.id !== chatId);
    setChatSessions(updatedSessions);
    saveSessions(updatedSessions);

    if (currentChatId === chatId) {
      if (updatedSessions.length > 0) {
        setCurrentChatId(updatedSessions[updatedSessions.length - 1].id);
      } else {
        createNewChat();
      }
    }
  };

  const switchChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setSidebarDrawerOpen(false);
  };

  const saveSessions = (sessions: ChatSession[]) => {
    localStorage.setItem("mindease-chat-sessions", JSON.stringify(sessions));
  };

  const handleSend = async () => {
    if (!input.trim() || !currentChatId) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: Date.now(),
    };

    // Update chat title if it's the first user message
    const isFirstUserMessage =
      currentChat?.messages.filter((m) => m.sender === "user").length === 0;
    const updatedMessages = [...(currentChat?.messages || []), newUserMsg];

    const updatedChat = {
      ...currentChat!,
      messages: updatedMessages,
      updatedAt: Date.now(),
      title: isFirstUserMessage
        ? input.slice(0, 30) + (input.length > 30 ? "..." : "")
        : currentChat?.title || "Chat Session",
    };

    // Update state
    const updatedSessions = chatSessions.map((chat) =>
      chat.id === currentChatId ? updatedChat : chat
    );
    setChatSessions(updatedSessions);
    setInput("");
    setLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setLoading(false)
      // Simulate typing effect
      let typedResponse = "";
      const typingInterval = setInterval(() => {
        if (typedResponse.length < data.response.length) {
          typedResponse = data.response.substring(0, typedResponse.length + 1);
          const newMessages = [
            ...updatedMessages,
            {
              id: `typing-${Date.now()}`,
              text: typedResponse,
              sender: "bot" as const,
              timestamp: Date.now(),
            },
          ];

          const newSessions = updatedSessions.map((chat) =>
            chat.id === currentChatId
              ? {
                ...updatedChat,
                messages: newMessages,
              }
              : chat
          );
          setChatSessions(newSessions);
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          setLoading(false);

          // Final update with complete message
          const finalMessages = [
            ...updatedMessages,
            {
              id: Date.now().toString(),
              text: data.response,
              sender: "bot" as const,
              timestamp: Date.now(),
            },
          ];

          const finalSessions = updatedSessions.map((chat) =>
            chat.id === currentChatId
              ? {
                ...updatedChat,
                messages: finalMessages,
              }
              : chat
          );
          setChatSessions(finalSessions);
          saveSessions(finalSessions);
          setLoading(false)
        }
      }, 20);
    } catch (error) {
      console.error("Error calling API:", error);
      const errorMessages = [
        ...updatedMessages,
        {
          id: Date.now().toString(),
          text: "Sorry, I'm having trouble connecting to my services. Please try again later.",
          sender: "bot" as const,
          timestamp: Date.now(),
        },
      ];

      const errorSessions = updatedSessions.map((chat) =>
        chat.id === currentChatId
          ? {
            ...updatedChat,
            messages: errorMessages,
          }
          : chat
      );
      setChatSessions(errorSessions);
      saveSessions(errorSessions);
      setIsTyping(false);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (authloading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden relative bg-gradient-to-br from-gray-900 to-gray-950">
      <ParticlesBackground />
      {/* Sidebar for desktop */}
      <div
        className={`fixed top-0 left-0 h-full z-30 transition-all duration-300 overflow-hidden hidden lg:block border-r border-gray-800
        ${sidebarOpen ? "w-64" : "w-0"}
        bg-gradient-to-b from-white/5 via-white/4 to-white/3
        backdrop-blur-sm text-white`}
      >
        {sidebarOpen && (
          <div className="flex flex-col h-full">
            <div className=" flex justify-between items-center p-4 border-b border-gray-800">
              <Button
                onClick={createNewChat}
                className="flex text-white items-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
              >
                <Plus className="size-4" /> New Chat
              </Button>
              <Button
                onClick={() => setSidebarOpen(false)}
                className="bg-transparent hover:bg-gray-800 transition-colors duration-200"
                size="icon"
              >
                <XIcon className="size-5 text-gray-300" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              {chatSessions.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => switchChat(chat.id)}
                  className={`relative p-3 cursor-pointer hover:bg-gray-800/50 transition-colors duration-200 mx-2 rounded-lg ${currentChatId === chat.id ? "bg-gray-800/70" : ""
                    }`}
                >
                  <div className="font-medium truncate pr-6 text-gray-100">
                    {chat.title}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(chat.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-800/50 rounded-md transition-colors duration-200">
                <Settings className="size-5 text-gray-300" />
                <span className="text-gray-300">Settings</span>
              </div>
              <Link href={"/mindease"} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-800/50 rounded-md transition-colors duration-200">
                <LogOut className="size-5 text-gray-300" />
                <span className="text-gray-300">Back To Home</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar for mobile */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white p-4 z-40 transform transition-transform duration-300 ease-in-out ${sidebarDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          } border-r border-gray-800`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-1 mb-4">
            <Button
              onClick={createNewChat}
              className="flex text-white items-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
            >
              <Plus className="size-4" /> New Chat
            </Button>
            <Button
              onClick={() => setSidebarDrawerOpen(false)}
              className="bg-transparent hover:bg-gray-800 transition-colors duration-200"
              size="icon"
            >
              <XIcon className="size-5 text-white" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {chatSessions.map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  switchChat(chat.id);
                  setSidebarDrawerOpen(false);
                }}
                className={`relative p-3 cursor-pointer hover:bg-gray-800/50 transition-colors duration-200 mx-2 rounded-lg ${currentChatId === chat.id ? "bg-gray-800/70" : ""
                  }`}
              >
                <div className="font-medium truncate pr-6 text-gray-100">
                  {chat.title}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(chat.updatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-800">
            <div className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-800/50 rounded-md transition-colors duration-200">
              <Settings className="size-5 text-gray-300" />
              <span className="text-gray-300">Settings</span>
            </div>
            <Link href={"/mindease"} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-800/50 rounded-md transition-colors duration-200">
              <LogOut className="size-5 text-gray-300" />
              <span className="text-gray-300">Back To Home</span>
            </Link>

          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Fixed header bar that spans the entire width */}
        <div className="bg-gray-900 pt-2 pb-8 px-2  md:p-2 md:left-0 sm:left-1/2 sm:right-0 fixed w-full z-20">
          <div className="flex items-center justify-between max-w-screen-xl mx-auto">
            {/* Left side - menu button */}
            <div className="flex items-center justify-start w-10">
              {!sidebarOpen && (
                <Button
                  onClick={() => setSidebarOpen(true)}
                  className="bg-transparent hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer hidden lg:flex"
                  size="icon"
                >
                  <MenuIcon className="size-6 text-gray-300" />
                </Button>
              )}
              {!sidebarDrawerOpen && (
                <button
                  onClick={() => setSidebarDrawerOpen(true)}
                  className="bg-transparent flex items-center justify-center p-2 rounded cursor-pointer shadow lg:hidden hover:bg-gray-800/50 transition-colors duration-200"
                >
                  <MenuIcon className="text-gray-300 size-6" />
                </button>
              )}
            </div>

            {/* Center - title and status - FIXED WIDTH AND POSITION */}
            <div className="lg:relative  lg:left-16 sm:absolute absolute left-1/2 sm:left-1/2 transform -translate-x-1/2 flex flex-col items-center mt-7 md:mt-1">
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600 ">
                MindEase
              </div>
              <div className="flex items-center justify-center space-x-1.5 mt-1 md:mt-1.5 px-2 py-0.5 rounded-full border border-white/50">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-gray-300">
                  Online
                </span>
              </div>
            </div>

            {/* Right side - empty space to balance the layout */}
            <div className="w-10"></div>
          </div>
        </div>

        {/* Chat messages */}
        <section
          className={`flex-1 min-h-screen overflow-y-auto pt-24 pb-20 px-2 sm:px-4 md:px-8 lg:px-12 xl:px-16 w-full scroll-smooth ${sidebarDrawerOpen ? "blur-xs" : ""
            }`}
        >
          <div className="flex flex-col gap-4 max-w-4xl mx-auto">
            {currentChat?.messages.map((message) =>
              message.sender === "user" ? (
                <UserBubble key={message.id}>{message.text}</UserBubble>
              ) : (
                <BotBubble key={message.id}>{message.text}</BotBubble>
              )
            )}
            {loading && <LoadingBubble />}
            <div ref={messagesEndRef} />
          </div>
        </section>

        {/* Input area */}
        <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-gray-900 to-gray-950 border-t border-gray-800 py-3 px-4 z-10">
          <div className="relative w-full max-w-3xl mx-auto">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              className="h-12 overflow-hidden p-4 pr-32 text-gray-200 bg-gray-800/50 text-sm rounded-xl shadow-sm resize-none w-full outline-none border border-gray-700 focus:border-indigo-500 placeholder:text-gray-500 backdrop-blur-sm transition-all duration-200"
              disabled={loading}
              rows={1}
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-1 pl-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-gray-400 hover:text-white hover:bg-gray-700/50"
              >
                <Smile className="size-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-gray-400 hover:text-white hover:bg-gray-700/50"
              >
                <Mic className="size-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-gray-400 hover:text-white hover:bg-gray-700/50"
              >
                <Link2 className="size-5" />
              </Button>
              <Button
                onClick={handleSend}
                size="icon"
                className={`rounded-lg w-7 h-7 transition-all duration-200 p-4 text-center cursor-pointer ${input.trim()
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-gray-700 text-gray-400"
                  }`}
                disabled={loading || isTyping || !input.trim()}
              >
                <Send className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="ml-auto w-full flex justify-end px-2 sm:px-4">
      <div className="max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[70%] rounded-xl rounded-br-none bg-gradient-to-r from-indigo-600 to-purple-700 px-4 py-3 text-white shadow-lg">
        <div className="text-sm whitespace-pre-wrap break-words">{children}</div>
      </div>
    </div>
  );
}


function BotBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="mr-auto flex max-w-[90%] md:max-w-[80%] lg:max-w-[75%] mb-4">
      <div className="relative group">
        {/* Mind icon for avatar */}
        <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-white"
          >
            <path d="M22 12.3c0 2.4-.9 4.5-2.4 6.1a8.37 8.37 0 0 1-5.3 2.4c-.4.1-.9.1-1.3.1-2.4 0-4.5-.9-6.1-2.4A8.35 8.35 0 0 1 4.5 13c-.1-.4-.1-.9-.1-1.3 0-2.4.9-4.5 2.4-6.1A8.35 8.35 0 0 1 12 3.2c.4-.1.9-.1 1.3-.1 2.4 0 4.5.9 6.1 2.4A8.35 8.35 0 0 1 22 11c.1.4.1.9.1 1.3ZM12 7v10" />
            <path d="M8 9h8" />
          </svg>
        </div>

        {/* Message bubble with proper tail */}
        <div className="relative rounded-xl rounded-tl-none bg-gray-800 px-4 py-3 text-gray-200 shadow-lg border border-gray-700">
          <div className="text-sm whitespace-pre-wrap leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingBubble() {
  return (
    <div className="mr-auto flex max-w-[90%] md:max-w-[80%] lg:max-w-[75%]">
      <div className="rounded-xl rounded-bl-none bg-gray-800 px-4 py-3 text-gray-200 shadow-lg">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
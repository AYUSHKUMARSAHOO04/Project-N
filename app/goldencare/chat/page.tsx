'use client'
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

export default function GoldencarePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const [input, setInput] = useState('');
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState('None');

  // API URL
  const API_URL = 'https://healthcare-chatbot-662622027382.europe-west1.run.app/chat';

  // Get current chat
  const currentChat = chatSessions.find((chat) => chat.id === currentChatId) || null;

  // Load chat sessions from localStorage on initial render
  useEffect(() => {
    const savedSessions = localStorage.getItem("goldencare-chat-sessions");
   const storedUserName = localStorage.getItem("goldencare_username");
if (storedUserName) {
  setUserName(storedUserName);
}
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
          text: "Hello! 😊 It's great to connect with you! I'm GoldenCare, your friendly health assistant. How can I help you today?",
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
    localStorage.setItem("goldencare-chat-sessions", JSON.stringify(sessions));
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
          user_name:userName,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      if(response.status===404){
        setLoading(false);
        setIsTyping(false);
        const errorMessages = [
          ...updatedMessages,
          {
            id: Date.now().toString(),
            text: "User Not Found, Please Register your report in Check-in",
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
        return;
      }

      const data = await response.json();

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
        }
      }, 10);
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
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <Button
                onClick={createNewChat}
                className="flex text-white items-center gap-2 text-sm bg-amber-600 hover:bg-amber-700 transition-colors duration-200"
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
                  className={`relative p-3 cursor-pointer hover:bg-gray-800/50 transition-colors duration-200 mx-2 rounded-lg ${
                    currentChatId === chat.id ? "bg-gray-800/70" : ""
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
              <div className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-800/50 rounded-md transition-colors duration-200">
                <LogOut className="size-5 text-gray-300" />
                <span className="text-gray-300">Logout</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar for mobile */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white p-4 z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-gray-800`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-1 mb-4">
            <Button
              onClick={createNewChat}
              className="flex text-white items-center gap-2 text-sm bg-amber-600 hover:bg-amber-700 transition-colors duration-200"
            >
              <Plus className="size-4" /> New Chat
            </Button>
            <Button
              onClick={() => setSidebarDrawerOpen(false)}
              className="bg-transparent hover:bg-gray-800 transition-colors duration-200"
              size="icon"
            >
              <XIcon className="size-5" />
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
                className={`relative p-3 cursor-pointer hover:bg-gray-800/50 transition-colors duration-200 mx-2 rounded-lg ${
                  currentChatId === chat.id ? "bg-gray-800/70" : ""
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
            <div className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-800/50 rounded-md transition-colors duration-200">
              <LogOut className="size-5 text-gray-300" />
              <span className="text-gray-300">Logout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Fixed header bar that spans the entire width */}
        <div className=" bg-gray-900
         pt-4 pb-6 px-2  md:p-2 md:left-0 sm:left-1/2 sm:right-0 fixed w-full z-20">
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
            <div className="lg:relative  lg:left-0 sm:absolute absolute left-1/2 sm:left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">
                GoldenCare
              </div>
              <div className="flex items-center justify-center space-x-1.5 mt-1.5 px-2 py-0.5 rounded-full border border-amber-500/50">
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
          className={`flex-1 min-h-screen overflow-y-auto pt-24 pb-20 px-2 sm:px-4 md:px-8 lg:px-12 xl:px-16 w-full scroll-smooth ${
            sidebarDrawerOpen ? "blur-xs" : ""
          }`}
        >
          <div className="flex flex-col gap-4 max-w-4xl mx-auto">
            {currentChat?.messages.map((message, index) =>
  message.sender === "user" ? (
    <UserBubble key={`${message.id}-${index}`}>{message.text}</UserBubble>
  ) : (
    <BotBubble key={`${message.id}-${index}`}>{message.text}</BotBubble>
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
              className="h-12 overflow-hidden p-4 pr-32 text-amber-200 bg-gray-800/50 text-sm rounded-xl shadow-sm resize-none w-full outline-none border border-gray-700 focus:border-amber-500 placeholder:text-gray-500 backdrop-blur-sm transition-all duration-200"
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
                className={`rounded-lg w-7 h-7 transition-all duration-200 ${
                  input.trim()
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
                disabled={loading || !input.trim()}
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
    <div className="ml-auto flex max-w-[90%] md:max-w-[80%] lg:max-w-[75%]">
      <div className="rounded-xl rounded-br-none bg-gradient-to-r from-indigo-600 to-purple-700 px-4 py-3 text-white shadow-lg">
        <div className="text-sm whitespace-pre-wrap">{children}</div>
      </div>
    </div>
  );
}

function BotBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="mr-auto flex max-w-[90%] md:max-w-[80%] lg:max-w-[75%] mb-4">
      <div className="relative group">
        {/* Health icon for avatar */}
        <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center shadow-md">
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
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
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
      <div className="rounded-xl rounded-bl-none bg-[#FEDAAD] px-4 py-3 text-black shadow-lg">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-amber-700 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-amber-700 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 rounded-full bg-amber-700 animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
"use client";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Link2,
  LogOut,
  MenuIcon,
  Mic,
  HeartPulse,
  Plus,
  Send,
  Settings,
  Smile,
  Trash2,
  XIcon,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import ParticlesBackground from "@/components/shared/particle-background";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: number;
  analysis_data?: {
    prediction: string;
    confidence: number;
    condition_type: string;
    affects: string;
    severity: string;
    class_probabilities: Record<string, number>;
  };
  image_preview?: string;
};

type ChatSession = {
  id: string;
  session_id: string; // Backend session ID
  title: string;
  createdAt: number;
  updatedAt: number;
  petType?: string;
  messages: Message[];
};

export default function PetAIPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const [input, setInput] = useState("");
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [petType, setPetType] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current chat
  const currentChat =
    chatSessions.find((chat) => chat.id === currentChatId) || null;

  // Load chat sessions from localStorage on initial render
  useEffect(() => {
    const savedSessions = localStorage.getItem("petai-chat-sessions");
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions);
      setChatSessions(sessions);
      if (sessions.length > 0) {
        setCurrentChatId(sessions[sessions.length - 1].id);
        const lastChat = sessions[sessions.length - 1];
        if (lastChat.petType) setPetType(lastChat.petType);
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

  const generateSessionId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const createNewChat = () => {
    const newSessionId = generateSessionId();
    const newChat: ChatSession = {
      id: Date.now().toString(),
      session_id: newSessionId,
      title: "New Chat",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        {
          id: Date.now().toString(),
          text: "Hello! I'm PetAI, your virtual veterinary assistant. 🐾 I can help with pet health questions, analyze skin conditions from photos, and provide general pet care advice. How can I help you today?",
          sender: "bot",
          timestamp: Date.now(),
        },
      ],
    };

    setChatSessions((prev) => [...prev, newChat]);
    setCurrentChatId(newChat.id);
    setPetType("");
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
    const chat = chatSessions.find((c) => c.id === chatId);
    if (chat?.petType) setPetType(chat.petType);
    // Clear any pending file selection when switching chats
    setSelectedFile(null);
    setImagePreview(null);
  };

  const saveSessions = (sessions: ChatSession[]) => {
    localStorage.setItem("petai-chat-sessions", JSON.stringify(sessions));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || !currentChatId) return;

    const currentChatData = currentChat!;
    let newUserMsg: Message;

    // Create user message
    if (selectedFile && input.trim()) {
      // Both image and text
      newUserMsg = {
        id: Date.now().toString(),
        text: input,
        sender: "user",
        timestamp: Date.now(),
        image_preview: imagePreview || undefined,
      };
    } else if (selectedFile) {
      // Image only
      newUserMsg = {
        id: Date.now().toString(),
        text: "📷 Uploaded image for analysis",
        sender: "user",
        timestamp: Date.now(),
        image_preview: imagePreview || undefined,
      };
    } else {
      // Text only
      newUserMsg = {
        id: Date.now().toString(),
        text: input,
        sender: "user",
        timestamp: Date.now(),
      };
    }

    // Check if this is the pet type response
    if (
      !petType &&
      input &&
      ["dog", "cat", "bird", "fish", "hamster", "rabbit", "reptile"].some(
        (pet) => input.toLowerCase().includes(pet)
      )
    ) {
      setPetType(input.toLowerCase());
    }

    // Update chat title if it's the first user message
    const isFirstUserMessage =
      currentChatData.messages.filter((m) => m.sender === "user").length === 0;
    const updatedMessages = [...currentChatData.messages, newUserMsg];

    const updatedChat = {
      ...currentChatData,
      messages: updatedMessages,
      updatedAt: Date.now(),
      title: isFirstUserMessage
        ? (input || "Image Analysis").slice(0, 30) + ((input || "Image Analysis").length > 30 ? "..." : "")
        : currentChatData.title,
      petType: petType || currentChatData.petType,
    };

    // Update state
    const updatedSessions = chatSessions.map((chat) =>
      chat.id === currentChatId ? updatedChat : chat
    );
    setChatSessions(updatedSessions);
    
    // Clear input and file
    const messageText = input;
    const fileToSend = selectedFile;
    setInput("");
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setLoading(true);
    setIsTyping(true);

    try {
      let response;
      
      if (fileToSend) {
        // Send with FormData for file upload
        const formData = new FormData();
        formData.append('file', fileToSend);
        formData.append('session_id', currentChatData.session_id);
        if (messageText.trim()) {
          formData.append('message', messageText);
        }

        response = await fetch("https://animal-skin-1093207603442.us-central1.run.app/health", {
          method: "POST",
          body: formData,
        });
      } else {
        // Send as JSON for text-only
        response = await fetch("https://animal-skin-1093207603442.us-central1.run.app/health", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: messageText,
            session_id: currentChatData.session_id,
          }),
        });
      }

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      // Update session_id if it's new
      if (data.session_id && data.session_id !== currentChatData.session_id) {
        updatedChat.session_id = data.session_id;
      }

      // Create bot response message
      const botMessage: Message = {
        id: Date.now().toString(),
        text: data.response,
        sender: "bot",
        timestamp: Date.now(),
        analysis_data: data.new_analysis || undefined,
      };

      // Simulate typing effect
      let typedResponse = "";
      const typingInterval = setInterval(() => {
        if (typedResponse.length < data.response.length) {
          typedResponse = data.response.substring(0, typedResponse.length + 1);
          const newMessages = [
            ...updatedMessages,
            {
              ...botMessage,
              text: typedResponse,
              id: `typing-${Date.now()}`,
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
          const finalMessages = [...updatedMessages, botMessage];

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
      }, 2);
    } catch (error) {
      console.error("Error calling API:", error);
      const errorMessages = [
        ...updatedMessages,
        {
          id: Date.now().toString(),
          text: "Sorry, I'm having trouble connecting to the pet advice service. Please try again later. 🐾",
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative bg-gradient-to-br from-gray-900 to-gray-950">
      <ParticlesBackground/>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Sidebar for desktop */}
      <div
        className={`fixed top-0 left-0 h-full z-30 transition-all duration-300 overflow-hidden hidden lg:block border-r border-gray-800
    ${sidebarOpen ? "w-64" : "w-0"}
    bg-gradient-to-b from-white/5 via-white/4 to-white/3
    backdrop-blur-sm text-white`}
      >
        {sidebarOpen && (
          <div className="flex flex-col h-full">
            <header className="flex items-center p-6 gap-2 border-b border-gray-700/10">
              <HeartPulse className="text-indigo-600 w-8 h-8" />
              <h1 className="font-semibold text-lg text-white">PET-AI</h1>
            </header>
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <Button
                onClick={createNewChat}
                className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
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
                    {chat.petType &&
                      ` • ${
                        chat.petType.charAt(0).toUpperCase() +
                        chat.petType.slice(1)
                      }`}
                  </div>
                 <div className="text-xs text-gray-500 mt-1">
  Session: {chat.session_id ? chat.session_id.slice(-8) : 'N/A'}
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
          sidebarDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } border-r border-gray-800`}
      >
        <header className="flex items-center p-6 gap-2 border-b border-gray-700/10">
          <HeartPulse className="text-indigo-600 w-8 h-8" />
          <h1 className="font-semibold text-lg text-white">PET-AI</h1>
        </header>

        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-1 mb-4">
            <Button
              onClick={createNewChat}
              className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
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
                  {chat.petType &&
                    ` • ${
                      chat.petType.charAt(0).toUpperCase() +
                      chat.petType.slice(1)
                    }`}
                </div>
                <div className="text-xs text-gray-500 mt-1">
  Session: {chat.session_id ? chat.session_id.slice(-8) : 'N/A'}
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
        {/* Fixed header bar */}
        <div className="bg-gray-900 pt-2 pb-8 px-2 md:p-2 fixed w-full z-20">
          <div className="flex items-center justify-between max-w-screen-xl mx-auto">
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

            <div className="lg:relative lg:left-0 sm:absolute absolute left-1/2 sm:left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                Pet AI
              </div>
              <div className="flex items-center justify-center space-x-1.5 mt-1.5 px-2 py-0.5 rounded-full border border-white/50">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-gray-300">
                  Online
                </span>
              </div>
            </div>

            <div className="w-10"></div>
          </div>
        </div>

        {/* Chat messages */}
        <section
          className={`flex-1 min-h-screen overflow-y-auto pt-24 pb-32 px-2 sm:px-4 md:px-8 lg:px-12 xl:px-16 w-full scroll-smooth ${
            sidebarDrawerOpen ? "blur-xs" : ""
          }`}
        >
          <div className="flex flex-col gap-4 max-w-4xl mx-auto">
            {currentChat?.messages.map((message) =>
              message.sender === "user" ? (
                <UserBubble key={message.id} message={message} />
              ) : (
                <BotBubble key={message.id} message={message} />
              )
            )}
            {loading && <LoadingBubble />}
            <div ref={messagesEndRef} />
          </div>
        </section>

        {/* File preview */}
        {imagePreview && (
          <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-lg p-2 border border-gray-700 z-20">
            <div className="flex items-center gap-2">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-16 h-16 object-cover rounded"
              />
              <span className="text-sm text-gray-300">Image ready to send</span>
              <Button
                onClick={removeSelectedFile}
                size="icon"
                className="w-6 h-6 bg-red-600 hover:bg-red-700"
              >
                <XIcon className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-gray-900 to-gray-950 border-t border-gray-800 py-3 px-4 z-10">
          <div className="relative w-full max-w-3xl mx-auto">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your pet or upload an image for analysis..."
              className="h-12 overflow-hidden p-4 pr-40 text-gray-200 bg-gray-800/50 text-sm rounded-xl shadow-sm resize-none w-full outline-none border border-gray-700 focus:border-blue-500 placeholder:text-gray-500 backdrop-blur-sm transition-all duration-200"
              disabled={loading}
              rows={1}
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-1 pl-2">
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="ghost" 
                size="icon" 
                className="w-7 h-7 text-gray-400 hover:text-white hover:bg-gray-700/50"
              >
                <ImageIcon className="size-5" />
              </Button>
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
                  input.trim() || selectedFile
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
                disabled={loading || (!input.trim() && !selectedFile)}
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

function UserBubble({ message }: { message: Message }) {
  return (
    <div className="ml-auto flex max-w-[90%] md:max-w-[80%] lg:max-w-[75%]">
      <div className="rounded-xl rounded-br-none bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-white shadow-lg">
        {message.image_preview && (
          <img 
            src={message.image_preview} 
            alt="User uploaded" 
            className="max-w-48 max-h-48 object-cover rounded-lg mb-2"
          />
        )}
        <div className="text-sm whitespace-pre-wrap">{message.text}</div>
        <div className="absolute bottom-0 right-0 w-3 h-3 -mr-3 bg-blue-600 rounded-bl-full"></div>
      </div>
    </div>
  );
}

function BotBubble({ message }: { message: Message }) {
  return (
    <div className="mr-auto flex max-w-[90%] md:max-w-[80%] lg:max-w-[75%] mb-4">
      <div className="relative group">
        <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
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
            <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5M8.5 11.5c-.828 0-1.5-.224-1.5-.5s.672-.5 1.5-.5 1.5.224 1.5.5-.672.5-1.5.5M15.5 11.5c-.828 0-1.5-.224-1.5-.5s.672-.5 1.5-.5 1.5.224 1.5.5-.672.5-1.5.5" />
            <path d="M12 18v-7" />
            <path d="M7 21s.5-3 5-3 5 3 5 3" />
          </svg>
        </div>

        <div className="relative rounded-xl rounded-tl-none bg-gray-800 px-4 py-3 text-gray-200 shadow-lg border border-gray-700">
          <div className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.text}
          </div>
          
          {message.analysis_data && (
            <div className="mt-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <HeartPulse className="size-5 text-red-400" />
                <h3 className="font-semibold text-gray-100">Skin Condition Analysis</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">Condition:</span>
                  <span className="ml-1 font-medium text-gray-100">
                    {message.analysis_data.prediction}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Confidence:</span>
                  <span className="ml-1 font-medium text-gray-100">
                    {message.analysis_data.confidence.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Type:</span>
                  <span className="ml-1 font-medium text-gray-100">
                    {message.analysis_data.condition_type}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Affects:</span>
                  <span className="ml-1 font-medium text-gray-100">
                    {message.analysis_data.affects}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Severity:</span>
                  <span className="ml-1 font-medium text-gray-100">
                    {message.analysis_data.severity}
                  </span>
                </div>
              </div>
              
              {message.image_preview && (
                <div className="mt-3">
                  <img 
                    src={message.image_preview} 
                    alt="Analysis preview" 
                    className="max-w-full max-h-48 rounded-lg border border-gray-600"
                  />
                </div>
              )}
            </div>
          )}
          
          
        </div>
      </div>
    </div>
  );
}

function LoadingBubble() {
  return (
    <div className="mr-auto flex max-w-[90%] md:max-w-[80%] lg:max-w-[75%] mb-4">
      <div className="relative group">
        <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
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
            <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5M8.5 11.5c-.828 0-1.5-.224-1.5-.5s.672-.5 1.5-.5 1.5.224 1.5.5-.672.5-1.5.5M15.5 11.5c-.828 0-1.5-.224-1.5-.5s.672-.5 1.5-.5 1.5.224 1.5.5-.672.5-1.5.5" />
            <path d="M12 18v-7" />
            <path d="M7 21s.5-3 5-3 5 3 5 3" />
          </svg>
        </div>

        <div className="relative rounded-xl rounded-tl-none bg-gray-800 px-4 py-3 text-gray-200 shadow-lg border border-gray-700">
          <div className="flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
       </div>
      </div>
    </div>
  );
}
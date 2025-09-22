"use client";
import axios from "axios";

import { ThemeProvider } from "next-themes";
import ParticlesBackground from "@/components/shared/particle-background";
import NoiseTexture from "@/components/shared/noise-texture";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, MessageSquarePlus, Settings, LogOut, HeartPulse, Trash2, User, Globe } from 'lucide-react';
import CustomCursor from "@/components/shared/custom-cursor";

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  detected_language?: string;
};

type ChatHistoryItem = {
  id: string;
  title: string;
  timestamp: Date;
  sessionId: string;
  messages: Message[];
  language: string;
};

// Backend API configuration - Updated to match your Flask APIf
const API_BASE_URL = "https://indiangrandparent-662622027382.europe-west1.run.app"; // Update this to your deployed URL when ready

// Supported languages from your backend
const SUPPORTED_LANGUAGES = {
  'en': { name: 'English', address: 'beta' },
  'hi': { name: 'Hindi', address: 'beta' },
  'bn': { name: 'Bengali', address: 'nanu' },
  'ta': { name: 'Tamil', address: 'paapa' },
  'te': { name: 'Telugu', address: 'tata' }
};

export default function IndianGrandparentChat() {
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

  const [inputValue, setInputValue] = useState<string>('');
  const [initialMessage] = useState<string>('Namaste beta! How is my little star today? Choose your language and tell your Nana what\'s on your mind! 🧓❤️');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Language selection
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // Initialize session and load chat history
  useEffect(() => {
    // Generate a unique session ID for this user
    const savedSessionId = localStorage.getItem('grandparentChatSessionId');
    if (savedSessionId) {
      setSessionId(savedSessionId);
    } else {
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      localStorage.setItem('grandparentChatSessionId', newSessionId);
    }

    // Load chat history from localStorage
    const storedHistory = localStorage.getItem('grandparentChatHistory');
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        const historyWithDates = parsedHistory.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
          messages: item.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setChatHistory(historyWithDates);
      } catch (error) {
        console.error('Error parsing chat history:', error);
      }
    }

    // Load saved language
    const savedLanguage = localStorage.getItem('grandparentChatLanguage');
    if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage as keyof typeof SUPPORTED_LANGUAGES]) {
      setSelectedLanguage(savedLanguage);
    }

    // Set initial welcome message
    setMessages([{
      id: generateId(),
      text: initialMessage,
      sender: 'bot',
      timestamp: new Date()
    }]);
  }, [initialMessage]);

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Save chat history to localStorage when it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('grandparentChatHistory', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // Save language to localStorage
  useEffect(() => {
    localStorage.setItem('grandparentChatLanguage', selectedLanguage);
  }, [selectedLanguage]);

  const generateSessionId = () => {
    return `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  };

  const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    // Clear session data on logout
    localStorage.removeItem('grandparentChatSessionId');
    localStorage.removeItem('grandparentChatHistory');
    localStorage.removeItem('grandparentChatLanguage');
    router.push("/HealthMatesecondLanding");
  };

  const handleNewChat = () => {
    if (messages.length > 1) { // Only save if there's more than just the initial message
      const firstUserMessage = messages.find(msg => msg.sender === 'user');
      const chatTitle = firstUserMessage 
        ? firstUserMessage.text.slice(0, 30) + (firstUserMessage.text.length > 30 ? '...' : '')
        : 'New Chat';
      
      const newChatItem: ChatHistoryItem = {
        id: generateId(),
        title: chatTitle,
        timestamp: new Date(),
        sessionId,
        messages,
        language: selectedLanguage
      };

      setChatHistory(prev => [newChatItem, ...prev]);
    }

    // Clear current chat
    clearChat();
    
    // Generate new session ID for new chat
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    localStorage.setItem('grandparentChatSessionId', newSessionId);
  };

  const loadChat = (chatId: string) => {
    const chatToLoad = chatHistory.find(chat => chat.id === chatId);
    if (chatToLoad) {
      setMessages(chatToLoad.messages);
      setSessionId(chatToLoad.sessionId);
      setSelectedLanguage(chatToLoad.language || 'en');
      setIsOpen(false); // Close sidebar after loading
    }
  };

  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering loadChat
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !sessionId) return;
    
    setIsLoading(true);
    
    try {
      const userMessage: Message = {
        id: generateId(),
        text: inputValue,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      const messageToSend = inputValue;
      setInputValue('');
      
      // Call your Indian Grandparent Chatbot API
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageToSend,
          session_id: sessionId,
          language: selectedLanguage
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 'success') {
        throw new Error(data.error || 'Unknown error occurred');
      }
      
      const botMessage: Message = {
        id: generateId(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date(data.timestamp),
        detected_language: data.detected_language
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Update language if detected differently
      if (data.detected_language && data.detected_language !== selectedLanguage) {
        setSelectedLanguage(data.detected_language);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: generateId(),
        text: "Arre beta, something went wrong! Please check if the server is running and try again. Your Nana is still here! 🧓",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: generateId(),
      text: initialMessage,
      sender: 'bot',
      timestamp: new Date()
    }]);
    setInputValue('');
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setShowLanguageSelector(false);
  };

  // Check API health
  const checkAPIHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch {
      return false;
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
    <ThemeProvider attribute="class" defaultTheme="dark">
      <ParticlesBackground />
      <CustomCursor
        containerRef={containerRef as React.RefObject<HTMLDivElement>}
      />
      <div className="min-h-screen bg-black text-white flex flex-col" ref={containerRef}>
        {/* Sidebar toggle button */}
        <button
          onClick={toggleSidebar}
          className={`fixed z-50 p-2 rounded-full transition-all ${
            isOpen
              ? "left-64 top-6 bg-gray-700/50"
              : "left-6 top-6 bg-indigo-600"
          }`}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? (
            <X className="text-white w-5 h-5" />
          ) : (
            <Menu className="text-white w-5 h-5" />
          )}
        </button>

        {/* Sidebar */}
        <div
          className={`fixed h-screen w-72 bg-white/10 backdrop-blur-lg border-r border-gray-700/20 flex flex-col z-40 transition-all duration-300 ${
            isOpen ? "left-0" : "-left-full"
          }`}
        >
          <div className="flex flex-row p-6 gap-2 border-b border-gray-700/10">
            <HeartPulse className="text-indigo-600 w-10 h-10" />
            <div>
              <h1 className="font-semibold text-lg text-white">Grandparent Chat</h1>
              <p className="text-xs text-gray-400">Indian Grandparent Bot</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between p-4">
            <div className="space-y-1">
              <button 
                onClick={handleNewChat}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <MessageSquarePlus className="w-5 h-5" />
                <span>New Chat</span>
              </button>

              <div className="mt-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Recent Chats</h3>
                <div className="space-y-1 max-h-[50vh] overflow-y-auto">
                  {chatHistory.map(chat => (
                    <div 
                      key={chat.id}
                      onClick={() => loadChat(chat.id)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{chat.title}</p>
                        <p className="text-xs text-gray-400">{formatDate(chat.timestamp)}</p>
                        <p className="text-xs text-gray-500">
                          Session: {chat.sessionId.split('_')[1]} • {SUPPORTED_LANGUAGES[chat.language as keyof typeof SUPPORTED_LANGUAGES]?.name || 'English'}
                        </p>
                      </div>
                      <button 
                        onClick={(e) => deleteChat(chat.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 p-1"
                        aria-label="Delete chat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {chatHistory.length === 0 && (
                    <p className="text-xs text-gray-500 px-2 py-1">No chat history yet</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="px-4 py-2 text-xs text-gray-500">
                Session ID: {sessionId.split('_')[1] || 'Loading...'}
              </div>
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

        {/* Main content */}
        <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 rounded-lg my-4">
          {/* Header */}
          <div className="text-center mb-4 pb-4">
            <h1 className="text-4xl font-bold text-blue-500 mb-2">Indian Grandparent</h1>
            <div className="inline-flex items-center bg-black rounded-full px-3 py-1 border border-green-500">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span className="text-sm text-green-500">Online</span>
            </div>
          </div>

          {/* Language Selection */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg border border-blue-500 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{SUPPORTED_LANGUAGES[selectedLanguage as keyof typeof SUPPORTED_LANGUAGES]?.name || 'English'}</span>
                <span className="text-xs">({SUPPORTED_LANGUAGES[selectedLanguage as keyof typeof SUPPORTED_LANGUAGES]?.address || 'beta'})</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {showLanguageSelector && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
                  {Object.entries(SUPPORTED_LANGUAGES).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => handleLanguageChange(key)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                        selectedLanguage === key ? 'bg-gray-700 text-blue-400' : 'text-white'
                      }`}
                    >
                      <span>{value.name}</span>
                      <span className="text-xs text-gray-400 ml-2">({value.address})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div ref={chatContainerRef} className="flex-1 mb-4 overflow-y-auto max-h-[50vh] px-2">
            <div className="flex flex-col space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white self-end rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl' 
                      : 'bg-blue-600 text-white self-start rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'
                  } p-4 max-w-[80%] shadow-lg`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                  {message.detected_language && message.detected_language !== selectedLanguage && (
                    <p className="text-xs mt-2 opacity-75">
                      Detected: {SUPPORTED_LANGUAGES[message.detected_language as keyof typeof SUPPORTED_LANGUAGES]?.name}
                    </p>
                  )}
                  <p className="text-xs mt-1 opacity-70">{formatDate(message.timestamp)}</p>
                </div>
              ))}
              
              {isLoading && (
                <div className="bg-blue-600 text-white p-3 rounded-lg self-start flex items-center space-x-2">
                  <span>Nana is thinking</span>
                  <span className="flex space-x-1">
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse" style={{animationDelay: '0.2s'}}>.</span>
                    <span className="animate-pulse" style={{animationDelay: '0.4s'}}>.</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="relative bottom-0 bg-gray-800 text-white rounded-full px-4 py-3 pr-36 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <input
              type="text"
              placeholder={`Type your message here, ${SUPPORTED_LANGUAGES[selectedLanguage as keyof typeof SUPPORTED_LANGUAGES]?.address || 'beta'}...`}
              className="w-[90%] bg-transparent focus:outline-none text-sm text-white placeholder-gray-400"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
            />
            <div className="absolute right-2 bottom-2 flex space-x-3 items-center">
              {/* Send button */}
              <button 
                className={`${
                  inputValue.trim() 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'bg-gray-600 cursor-not-allowed'
                } text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors`}
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                title="Send message"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>

          {/* Session Info */}
          <div className="text-center mt-2">
            <p className="text-xs text-gray-500">
              Session: {sessionId} | Language: {SUPPORTED_LANGUAGES[selectedLanguage as keyof typeof SUPPORTED_LANGUAGES]?.name}
            </p>
          </div>
        </main>

        {/* Click outside to close dropdowns */}
        {showLanguageSelector && (
          <div
            className="fixed inset-0 z-5"
            onClick={() => setShowLanguageSelector(false)}
          />
        )}
      </div>
    </ThemeProvider>
  );
}
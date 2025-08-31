import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, MessageSquarePlus, Settings, LogOut, HeartPulse, Trash2 } from 'lucide-react';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  image?: string;
  sources?: string[]; // Added for source documents
  advice?: string;   // Added for structured advice
};

type ChatHistoryItem = {
  id: string;
  title: string;
  timestamp: Date;
  sessionId: string | null;
  messages: Message[];
};

const API_BASE_URL = "https://ayurvedic-1093207603442.us-central1.run.app/health";

export default function AyurvedaChat() {
  const [inputValue, setInputValue] = useState<string>('');
  const [initialMessage] = useState<string>('Welcome to the Ayurveda Chat. How can I help you today?');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Initialize session and load chat history
  useEffect(() => {
    // Try to get session ID from localStorage first
    const savedSessionId = localStorage.getItem('ayurvedaSessionId');
    if (savedSessionId) {
      setSessionId(savedSessionId);
    } else {
      // Create new session if none exists
      createNewSession();
    }

    // Load chat history from localStorage
    const storedHistory = localStorage.getItem('ayurvedaChatHistory');
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        // Convert string timestamps back to Date objects
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
      localStorage.setItem('ayurvedaChatHistory', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // Save session ID to localStorage when it changes
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('ayurvedaSessionId', sessionId);
    }
  }, [sessionId]);

  const createNewSession = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to create session');
      
      const data = await response.json();
      setSessionId(data.session_id);
    } catch (error) {
      console.error('Error creating session:', error);
      // Fallback: generate a local session ID
      setSessionId(generateId());
    }
  };

  const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    // Clear session data on logout
    localStorage.removeItem('ayurvedaSessionId');
    localStorage.removeItem('ayurvedaChatHistory');
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
        messages
      };

      setChatHistory(prev => [newChatItem, ...prev]);
    }

    // Clear current chat
    clearChat();
    
    // Create a new session for the new chat
    createNewSession();
  };

  const loadChat = (chatId: string) => {
    const chatToLoad = chatHistory.find(chat => chat.id === chatId);
    if (chatToLoad) {
      setMessages(chatToLoad.messages);
      setSessionId(chatToLoad.sessionId);
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

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sessionId) return;
    
    setIsLoading(true);
    setPdfFileName(file.name);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('session_id', sessionId);
      
      // If there's a message, include it as a question about the PDF
      if (inputValue.trim()) {
        formData.append('message', inputValue.trim());
      }
      
      const response = await fetch(`${API_BASE_URL}/chat/`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('PDF upload failed');
      
      const data = await response.json();
      
      // Add user message if there was one
      if (inputValue.trim()) {
        const userMessage: Message = {
          id: generateId(),
          text: inputValue,
          sender: 'user',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
      }
      
      // Add PDF upload notification
      const uploadMessage: Message = {
        id: generateId(),
        text: `Uploaded PDF: ${file.name}`,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, uploadMessage]);
      
      // Add bot response
      const botMessage: Message = {
        id: generateId(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Error uploading PDF:', error);
      const errorMessage: Message = {
        id: generateId(),
        text: "Sorry, there was an error uploading your PDF. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
      setInputValue('');
      
      const response = await fetch(`${API_BASE_URL}/get_remedy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: inputValue,
          session_id: sessionId
        })
      });
      
      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      
      const botMessage: Message = {
        id: generateId(),
        text: data.advice,
        sender: 'bot',
        timestamp: new Date(),
        advice: data.advice,
        sources: data.sources
      };
      
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: generateId(),
        text: "Sorry, I couldn't process your message. Please try again later.",
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
    setPdfFileName(null);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
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
          <h1 className="font-semibold text-lg text-white">Healthmate</h1>
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
          <h1 className="text-4xl font-bold text-blue-500 mb-2">Healthmate</h1>
          <div className="inline-flex items-center bg-black rounded-full px-3 py-1 border border-green-500">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span className="text-sm text-green-500">Online</span>
          </div>
        </div>

        {/* PDF upload indicator */}
        {pdfFileName && (
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              <span className="text-sm text-blue-300 truncate max-w-xs">{pdfFileName}</span>
            </div>
            <button 
              onClick={() => setPdfFileName(null)}
              className="text-blue-400 hover:text-white"
              title="Remove PDF"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Chat Area */}
          <div ref={chatContainerRef} className="flex-1 mb-4 overflow-y-auto max-h-[50vh] px-2">
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`${
                message.sender === 'user' 
                  ? 'bg-blue-800 text-white self-end rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                  : 'bg-blue-600 text-white self-start rounded-tr-lg rounded-br-lg rounded-bl-lg'
              } p-4 max-w-[80%] shadow`}
            >
              {message.sender === 'bot' && message.advice ? (
                <div className="space-y-3">
                  <div className="whitespace-pre-line">{message.advice}</div>
                  
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-blue-400/30">
                      <h4 className="text-xs font-semibold text-blue-200 mb-1">References:</h4>
                      <ul className="text-xs space-y-1">
                        {message.sources.map((source, index) => (
                          <li key={index} className="text-blue-300">
                            {source.split('\n').slice(0, 3).join(' ')}...
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="whitespace-pre-line">{message.text}</p>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="bg-gray-800 text-white p-3 rounded-lg self-start flex items-center space-x-2">
              <span>Processing</span>
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
            placeholder="Type your message here..."
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
            {/* PDF upload button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePdfUpload}
              accept=".pdf"
              className="hidden"
            />
            
            {/* <button 
              className="text-gray-400 hover:text-white w-7 h-7 flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              title="Upload PDF"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </button>
             */}
            {/* Send button */}
            <button 
              className={`${
                inputValue.trim() 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-gray-600 cursor-not-allowed'
              } text-white rounded-full w-8 h-8 flex items-center justify-center`}
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
      </main>
    </div>
  );
}
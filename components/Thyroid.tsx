import { useState, useEffect, useRef } from 'react';
import { Menu, X, MessageSquarePlus, Settings, LogOut, HeartPulse, Trash2, Minimize2, Maximize2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  image?: string; // Base64 encoded image
};

type PredictionLabel = 'Benign' | 'Malignant' | 'Normal';

type ThyroidPredictionData = {
  prediction: PredictionLabel;
  confidence_scores: {
    Benign: number;
    Malignant: number;
    Normal: number;
  };
  explanation: string;
  session_id: string;
};

type ChatHistoryItem = {
  id: string;
  title: string;
  timestamp: Date;
  sessionId: string | null;
  messages: Message[];
};

export default function Thyroid() {
  const [inputValue, setInputValue] = useState<string>('');
  const [initialMessage] = useState<string>('Welcome to the Thyroid CT Analysis section. Please upload a Thyroid CT scan image first to begin analysis and discussion.');
  const apiUrl = "https://thyroid-1093207603442.us-central1.run.app"; // Update this to your API URL
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [predictionData, setPredictionData] = useState<ThyroidPredictionData | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isAnalysisMinimized, setIsAnalysisMinimized] = useState<boolean>(false);
  const router = useRouter();
  
  // Initialize with welcome message
  useEffect(() => {
    setMessages([{
      id: generateId(),
      text: initialMessage,
      sender: 'bot',
      timestamp: new Date()
    }]);
  }, [initialMessage]);


  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleAnalysisMinimize = () => setIsAnalysisMinimized(!isAnalysisMinimized);
  
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
  };


  const loadChat = (chatId: string) => {
    const chatToLoad = chatHistory.find(chat => chat.id === chatId);
    if (chatToLoad) {
      setMessages(chatToLoad.messages);
      setSessionId(chatToLoad.sessionId);
      setAnalysisComplete(!!chatToLoad.sessionId);
      // You might need to set other states based on the loaded chat
      setIsOpen(false); // Close sidebar after loading
    }
  };

  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering loadChat
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
  };

  const handleLogout = () => {
    router.push("/HealthMatesecondLanding");
  };

  const formatDate = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Generate a unique ID for messages
  const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadCTScan = async () => {
    if (!selectedImage) return;
    
    setIsLoading(true);
    
    try {
      // Add user message with image
      const userMessage: Message = {
        id: generateId(),
        text: "Please analyze this Thyroid CT scan.",
        sender: 'user',
        timestamp: new Date(),
        image: previewImage || undefined
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', selectedImage);
      
      // Add processing message
      const processingMessage: Message = {
        id: generateId(),
        text: "Analyzing your Thyroid CT scan...",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, processingMessage]);
      
      // Make API call to predict endpoint
      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data: ThyroidPredictionData = await response.json();
      console.log('Thyroid CT analysis response:', data);
      
      // Store prediction data and session ID
      setPredictionData(data);
      setSessionId(data.session_id);
      setAnalysisComplete(true);
      
      // Remove the processing message
      setMessages(prev => prev.filter(msg => msg.id !== processingMessage.id));
      
      // Create analysis summary
      const confidence = data.confidence_scores[data.prediction as keyof typeof data.confidence_scores];
      
      let summaryText = `Analysis Complete!\n\n`;
      summaryText += `Classification: ${data.prediction}\n`;
      summaryText += `Confidence: ${confidence.toFixed(1)}%\n\n`;
      summaryText += `Confidence Scores:\n`;
      summaryText += `- Benign: ${data.confidence_scores.Benign.toFixed(1)}%\n`;
      summaryText += `- Malignant: ${data.confidence_scores.Malignant.toFixed(1)}%\n`;
      summaryText += `- Normal: ${data.confidence_scores.Normal.toFixed(1)}%\n\n`;
      summaryText += `Medical Analysis:\n${data.explanation}\n\nYou can now ask me questions about this analysis.`;
      
      // Add analysis result message
      const resultMessage: Message = {
        id: generateId(),
        text: summaryText,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, resultMessage]);
      
      // Reset image selection
      setSelectedImage(null);
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Error uploading CT scan:', error);
      // Remove processing message if it exists
      setMessages(prev => prev.filter(msg => msg.text !== "Analyzing your Thyroid CT scan..."));
      
      // Add error message
      const errorMessage: Message = {
        id: generateId(),
        text: `Sorry, there was an error analyzing your CT scan: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again later.`,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // If no analysis has been done yet, prompt user to upload first
    if (!analysisComplete || !sessionId) {
      const promptMessage: Message = {
        id: generateId(),
        text: "Please upload a Thyroid CT image first before asking questions. I need to analyze an image to provide meaningful discussion.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, promptMessage]);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Add user message
      const userMessage: Message = {
        id: generateId(),
        text: inputValue,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);

      // Make API call to chat endpoint with JSON payload
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          session_id: sessionId
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Chat response:', data);
      
      // Add bot response
      const botMessage: Message = {
        id: generateId(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Reset input
      setInputValue('');
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage: Message = {
        id: generateId(),
        text: `Sorry, I couldn't process your message: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again later.`,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAnalysisResults = () => {
    if (!predictionData) return null;
    
    const confidence = predictionData.confidence_scores[predictionData.prediction];
    const confidencePercent = confidence.toFixed(1) + '%';
    
    return (
      <div className="bg-gray-800 rounded-lg mt-4 mb-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-blue-400 font-bold">Thyroid CT Analysis Results</h3>
          <button
            onClick={toggleAnalysisMinimize}
            className="text-gray-400 hover:text-white transition-colors"
            title={isAnalysisMinimized ? "Expand results" : "Minimize results"}
          >
            {isAnalysisMinimized ? (
              <Maximize2 className="w-5 h-5" />
            ) : (
              <Minimize2 className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {!isAnalysisMinimized && (
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 font-medium">Classification:</span>
              <span className={
                predictionData.prediction === 'Malignant' ? 'text-red-400 font-bold' :
                predictionData.prediction === 'Benign' ? 'text-yellow-400 font-bold' :
                'text-green-400 font-bold'
              }>
                {predictionData.prediction}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 font-medium">Confidence:</span>
              <span className="text-blue-300 font-bold">{confidencePercent}</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${confidence}%` }}
              ></div>
            </div>
            <div className="mt-2">
              <span className="text-gray-300 font-medium text-sm">All Confidence Scores:</span>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Benign:</span>
                  <span className="text-yellow-300">{predictionData.confidence_scores.Benign.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Malignant:</span>
                  <span className="text-red-300">{predictionData.confidence_scores.Malignant.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Normal:</span>
                  <span className="text-green-300">{predictionData.confidence_scores.Normal.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isAnalysisMinimized && (
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">
                Classification: <span className={
                  predictionData.prediction === 'Malignant' ? 'text-red-400 font-bold' :
                  predictionData.prediction === 'Benign' ? 'text-yellow-400 font-bold' :
                  'text-green-400 font-bold'
                }>
                  {predictionData.prediction}
                </span>
              </span>
              <span className="text-sm text-blue-300 font-bold">{confidencePercent}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const clearChat = () => {
    // Reset all states
    setMessages([{
      id: generateId(),
      text: initialMessage,
      sender: 'bot',
      timestamp: new Date()
    }]);
    setPredictionData(null);
    setSessionId(null);
    setAnalysisComplete(false);
    setSelectedImage(null);
    setPreviewImage(null);
    setInputValue('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (


    <div className="min-h-screen bg-black text-white flex flex-col">

      <button
        onClick={toggleSidebar}
        className={`fixed z-50 p-2 rounded-full transition-all ${
          isOpen
            ? "left-56 top-6 bg-gray-700/50"
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

      <main className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-4 rounded-lg my-4">
        {/* Header */}
        <div className="text-center mb-4 pb-4">
          <h1 className="text-4xl font-bold text-blue-500 mb-2">Healthmate</h1>
          <div className="inline-flex items-center bg-black rounded-full px-3 py-1 border border-green-500">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span className="text-sm text-green-500">Online</span>
          </div>
        </div>

        {/* Analysis Status */}
        {!analysisComplete && (
          <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-3 mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              <span className="text-yellow-200 text-sm">Please upload a Thyroid CT scan image to begin analysis</span>
            </div>
          </div>
        )}

        {/* Chat Area - Made wider */}
        <div ref={chatContainerRef} className="flex-1 mb-4 overflow-y-auto max-h-[60vh] px-2">
          <div className="flex flex-col space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`${
                  message.sender === 'user' 
                    ? 'bg-blue-800 text-white self-end rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                    : 'bg-blue-600 text-white self-start rounded-tr-lg rounded-br-lg rounded-bl-lg'
                } p-3 max-w-[85%] shadow`}
              >
                <p className="whitespace-pre-line">{message.text}</p>
                {message.image && (
                  <img 
                    src={message.image} 
                    alt="Thyroid CT scan" 
                    className="mt-2 max-h-64 rounded-lg border border-gray-300" 
                  />
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
        
        {/* Thyroid CT Analysis Results */}
        {predictionData && renderAnalysisResults()}
        
        {/* Image preview for upload */}
        {previewImage && (
          <div className="relative self-start mb-4 w-full">
            <div className="bg-gray-800 p-3 rounded-lg">
              <h3 className="text-blue-400 font-bold mb-2">Ready to analyze CT scan:</h3>
              <div className="relative inline-block">
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="max-h-64 rounded-lg border border-gray-600"
                />
                <button 
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="mt-3">
                <button 
                  className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 flex items-center"
                  onClick={handleUploadCTScan}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span>Analyzing...</span>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 mr-2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      Analyze CT Scan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="relative bg-gray-800 text-white rounded-full px-4 py-3 pr-36 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <input
            type="text"
            placeholder={analysisComplete 
              ? "Ask questions about the CT scan analysis..." 
              : "Upload a Thyroid CT scan image first to enable chat"
            }
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
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            {/* Upload CT scan button */}
            <button 
              className="text-gray-400 hover:text-white w-7 h-7 flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              title="Upload CT scan"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </button>
            
            {/* Send Icon (Paper Plane) */}
            <button 
              className={`${
                inputValue.trim() && analysisComplete 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-gray-600 cursor-not-allowed'
              } text-white rounded-full w-8 h-8 flex items-center justify-center`}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || !analysisComplete || isLoading}
              title={!analysisComplete ? "Upload and analyze a CT scan first" : "Send message"}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center text-gray-400 text-sm">
          {!analysisComplete 
            ? "Step 1: Upload a Thyroid CT scan image using the upload button above"
            : "Step 2: Ask questions about your CT scan analysis results"
          }
        </div>
      </main>
    </div>
  );
}
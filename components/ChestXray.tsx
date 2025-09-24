// components/Healthmate.tsx
import { useState, useEffect, useRef } from 'react';
import Sidebar from './Footer/Slider';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  image?: string; // Base64 encoded image
};

type XrayAnalysisData = {
  findings: Record<string, number>;
  explanation: string;
  top_condition: string;
  confidence: number;
};

export default function ChestXray() {
  const [inputValue, setInputValue] = useState<string>('');
  const [initialMessage, setInitialMessage] = useState<string>('Welcome to the Chest X-ray Analysis section. Upload a chest X-ray image or ask questions about chest X-rays.');
  const apiUrl="https://chest-x-ray-1063553229026.asia-south1.run.app"
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [xrayData, setXrayData] = useState<XrayAnalysisData | null>(null);
  const [inputShow, setInputShow] = useState<string>("none");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
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

  const handleUploadXray = async () => {
    if (!selectedImage) return;
    
    // Get the current message text (could be empty)
    const messageText = inputValue.trim() || "Here's my chest X-ray for analysis.";
    
    setIsLoading(true);
    
    try {
      // Add user message with image and text
      const userMessage: Message = {
        id: generateId(),
        text: messageText,
        sender: 'user',
        timestamp: new Date(),
        image: previewImage || undefined
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', selectedImage);
      // Add the user's message to the form data
      formData.append('message', messageText);
      
      // Add processing message
      const processingMessage: Message = {
        id: generateId(),
        text: "Analyzing your chest X-ray...",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, processingMessage]);
      
      // Make API call to upload-xray endpoint
      const response = await fetch(`${apiUrl}/upload-xray`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      console.log('X-ray analysis response:', data);
      
      // Store X-ray data
      setXrayData(data);
      
      // Remove the processing message
      setMessages(prev => prev.filter(msg => msg.id !== processingMessage.id));
      
      // Add response message with analysis results
      const resultMessage: Message = {
        id: generateId(),
        text: `I've analyzed your chest X-ray. The primary finding is ${data.top_condition} with ${data.confidence.toFixed(1)}% confidence. ${data.explanation}`,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, resultMessage]);
      
      // Reset input and image
      setInputValue('');
      setSelectedImage(null);
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Error uploading X-ray:', error);
      // Add error message
      const errorMessage: Message = {
        id: generateId(),
        text: "Sorry, there was an error analyzing your X-ray. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedImage) return;
    
    // If there is an image selected, use the combined upload function
    if (selectedImage) {
      await handleUploadXray();
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
      
      // Make API call to chat endpoint
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: inputValue
        })
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      console.log('Chat response:', data);
      
      // Update X-ray data if present
      if (data.xray_data) {
        setXrayData(data.xray_data);
      }
      
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
        text: "Sorry, I couldn't process your message. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFindingsChart = () => {
    if (!xrayData || !xrayData.findings) return null;
    
    // Get top 5 findings
    const topFindings = Object.entries(xrayData.findings)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    return (
      <div className="bg-gray-800 p-4 rounded-lg mt-4 mb-4">
        <h3 className="text-blue-400 font-bold mb-2">X-ray Analysis Results</h3>
        <div className="space-y-2">
          {topFindings.map(([condition, confidence], index) => (
            <div key={index} className="flex flex-col">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">{condition}</span>
                <span className="text-blue-300">{confidence.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${confidence}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-sm text-gray-400">
          <p>Top condition: {xrayData.top_condition} ({xrayData.confidence.toFixed(1)}%)</p>
        </div>
      </div>
    );
  };

  const clearChat = async () => {
    try {
      await fetch(`${apiUrl}/clear-chat`, {
        method: 'POST'
      });
      
      // Reset states
      setMessages([{
        id: generateId(),
        text: initialMessage,
        sender: 'bot',
        timestamp: new Date()
      }]);
      setXrayData(null);
      
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Sidebar/>
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 rounded-lg my-4">
        {/* Header */}
        <div className="text-center mb-4 pb-4">
          <h1 className="text-4xl font-bold text-blue-500 mb-2">HealthMate</h1>
          <div className="inline-flex items-center bg-black rounded-full px-3 py-1 border border-green-500">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span className="text-sm text-green-500">Online</span>
          </div>
        </div>

        {/* Chat Area */}
        <div ref={chatContainerRef} className="flex-1 mb-4 overflow-y-auto max-h-[60vh] px-2">
          <div className="flex flex-col space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`${
                  message.sender === 'user' 
                    ? 'bg-blue-800 text-white self-end rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                    : 'bg-blue-600 text-white self-start rounded-tr-lg rounded-br-lg rounded-bl-lg'
                } p-3 max-w-[80%] shadow`}
              >
                <p>{message.text}</p>
                {message.image && (
                  <img 
                    src={message.image} 
                    alt="User uploaded" 
                    className="mt-2 max-h-64 rounded-lg" 
                  />
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="bg-gray-800 text-white p-3 rounded-lg self-start flex items-center space-x-2">
                <span>Analyzing</span>
                <span className="flex space-x-1">
                  <span className="animate-pulse">.</span>
                  <span className="animate-pulse animation-delay-200">.</span>
                  <span className="animate-pulse animation-delay-400">.</span>
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* X-ray Analysis Results */}
        {xrayData && renderFindingsChart()}
        
      
        {/* Image preview */}
        {previewImage && (
          <div className="relative self-start mb-4 w-full">
            <div className="bg-gray-800 p-3 rounded-lg">
              <h3 className="text-blue-400 font-bold mb-2">Ready to analyze:</h3>
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
                <p className="text-gray-300 text-sm mb-2">Add a message with your X-ray (optional):</p>
                <input
                  type="text"
                  placeholder="Describe any symptoms or concerns..."
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={inputValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                />
                <button 
                  className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 flex items-center"
                  onClick={handleUploadXray}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span>Analyzing...</span>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 mr-2">
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                        <path d="M16 5V3"></path>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                        <path d="M9 9h.01"></path>
                        <path d="M15 9h.01"></path>
                      </svg>
                      Analyze X-ray with Message
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
            placeholder={inputShow}
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
            
            {/* Upload X-ray button */}
            <button 
              className="text-gray-400 hover:text-white w-7 h-7 flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
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
                (inputValue.trim() || selectedImage) ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-600 cursor-not-allowed'
              } text-white rounded-full w-8 h-8 flex items-center justify-center`}
              onClick={handleSendMessage}
              disabled={(!inputValue.trim() && !selectedImage) || isLoading}
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
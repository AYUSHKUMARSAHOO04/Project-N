// components/Healthmate.tsx
import { useState, useEffect, useRef } from 'react';
import Sidebar from './Footer/Slider';
import ChestXray from '@/components/ChestXray';
import Sonography from './Sonography';
import Mri from '@/components/Mri';
import { Sono } from 'next/font/google';
import KidneyCTAnalysis from './Kidneyct';
import XRayAnalyzer from './Xray';
import Thyroid from './Thyroid';
import GeneralChat from './GeneralChat';
import AyurvedaChat from './AyurvedaChat';

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

export default function Home() {
  const [inputValue, setInputValue] = useState<string>('');
  const [initialMessage, setInitialMessage] = useState<string>('Welcome to the Chest X-ray Analysis section. Upload a chest X-ray image or ask questions about chest X-rays.');
  const [apiUrl, setApiUrl] = useState<string>("https://chest-x-ray-1063553229026.asia-south1.run.app");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [xrayData, setXrayData] = useState<XrayAnalysisData | null>(null);
  const [inputShow, setInputShow] = useState<string>("none");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [catType, setCatType] = useState("none");
  
  // Generate a unique ID for messages
  const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };
    useEffect(() => {
    // Client-side only code
    if (typeof window !== 'undefined') {
      // Get the category from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const category = urlParams.get('category');
      
      if (category) {
        // Set specific initial message based on category
        switch(category) {
          case 'kidney-ct':
            setCatType("kidney-ct");
            setInitialMessage('I see you\'re interested in Kidney CT scans. How can I help with your kidney health today?');
            console.log('Category detected: kidney-ct');
            break;
          case 'chest-xray':
            setCatType("chest-xray");
            setApiUrl("https://chest-xray-vf3b.onrender.com");
            setInputShow("Ask about chest X-rays or medical imaging...")
            setInitialMessage('Welcome to the Chest X-ray section. What would you like to know about your chest X-ray results?');
            console.log('Category detected: chest-xray');
            break;
          case 'mri':
            setCatType("mri");
            setInitialMessage('I can help you understand your MRI results. What specific information are you looking for?');
            console.log('Category detected: mri');
            break;
          case 'xray':
            setCatType("xray");
            setInitialMessage('Looking at X-ray results? I can help explain what they mean. What area was examined?');
            console.log('Category detected: xray');
            break;
          case 'thyroid':
            setCatType("thyroid");
            setInitialMessage('Welcome to the thyroid health section. How can I assist with your thyroid concerns today?');
            console.log('Category detected: thyroid');
            break;
          case 'sonography':
            setCatType("sonography");
            setInputShow("Ask about sonography or ultrasound results...")
            setInitialMessage('I can help interpret sonography results. What specific ultrasound are you interested in discussing?');
            console.log('Category detected: sonography');
            break;
          case 'biopsy':
            setCatType("biopsy");
            setInitialMessage('I understand you\'re looking at biopsy information. I can help explain biopsy procedures and results. What would you like to know?');
            console.log('Category detected: biopsy');
            break;
          case 'other':
            setInitialMessage('You\'ve selected Other medical categories. Please let me know what specific health topic you\'d like assistance with.');
            console.log('Category detected: other');
            break;
          case 'ayurveda':
            setCatType("ayurveda");
            setInitialMessage('You\'ve selected Ayurveda. Please let me know what specific health topic you\'d like assistance with.');
            console.log('Category detected: ayurveda');
            break;
          default:
            setInitialMessage('How can I assist you with your health today?');
            console.log('No specific category detected or invalid category');
        }
      } else {
        console.log('No category parameter found in URL');
      }
    }
  }, []); // Empty dependency array ensures this runs once on mount

  // Auto-scroll to bottom of chat when new messages arrive
  

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
      {catType === "chest-xray" && 
      <ChestXray/>}
      {catType==="sonography" &&
      <Sonography/>}
      {catType==="kidney-ct" &&
      <KidneyCTAnalysis/>}
      {catType==="mri" &&
      <Mri/>}
      {catType==="xray" &&
      <XRayAnalyzer/>}
      {catType==="thyroid" &&
      <Thyroid/>}
      {catType==="biopsy" &&
      <GeneralChat/>}
      {catType==="other" &&
      <GeneralChat/>}
      {catType==="ayurveda" && 
      <AyurvedaChat/>}
    </div>
  );
}
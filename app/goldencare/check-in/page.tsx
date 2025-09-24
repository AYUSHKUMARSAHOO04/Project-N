"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Activity, 
  Heart, 
  Droplet, 
  Moon, 
  BellPlus,
  LogOut 
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import CreateUserProfile from '@/components/GoldenCare/CreateUserProfile';
import ParticlesBackground from '@/components/shared/particle-background';
// API URL - Replace with your actual API URL when deploying
const API_URL = 'https://grandparent-1063553229026.asia-south1.run.app' ;

const HealthCheckInPage = () => {
  const [user, setUser] = useState(null);
    const [authloading, setAuthLoading] = useState(true);
    const router = useRouter();

    //checking user authentication
  // useEffect(() => {
  //   const base = process.env.NEXT_PUBLIC_API_URL;
  //   axios
  //     .get(`${base}/auth/user`, {
  //       withCredentials: true,
  //     })
  //     .then((res) => {
  //       setUser(res.data.user);
  //       setAuthLoading(false);
  //     })
  //     .catch(() => {
  //       setUser(null);
  //       setAuthLoading(false);
  //       router.push("/signup");
  //     });
  // }, [router]);

  // State for user name entry
  const [name, setName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // State for health check-in form
  const [systolicBP, setSystolicBP] = useState(120);
  const [diastolicBP, setDiastolicBP] = useState(80);
  const [bloodSugar, setBloodSugar] = useState(0);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState(3);
  const [medicationTaken, setMedicationTaken] = useState(true);
  const [sleep, setSleep] = useState('Good');
  const [appetite, setAppetite] = useState('Normal');
  const [isNewUser, setIsNewUser] = useState(false);

  // State for advice after submission
  const [advice, setAdvice] = useState('');

  // Check localStorage on initial load
  useEffect(() => {
    const storedName = localStorage.getItem('goldencare_username');
    if (storedName) {
      setName(storedName);
      fetchUserData(storedName);
    }
  }, []);

  // Handle name submission
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // Save name to localStorage
      localStorage.setItem('goldencare_username', name);
      fetchUserData(name);
    }
  };

  // Fetch user data
  const fetchUserData = async (userName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/${userName}`);
      if (response.ok) {
        setIsLoggedIn(true);
        setIsNewUser(false);
        setMessage({type: 'success', text: `Welcome back, ${userName}!`});
      } else {
        setIsNewUser(true);
        setIsLoggedIn(false);
        setMessage({type: 'error', text: 'User not found. Please create a profile first.'});
      }
    } catch (error) {
      setMessage({type: 'error', text: 'Error connecting to server. Please try again.'});
    } finally {
      setLoading(false);
    }
  };

  // Handle health check-in submission
  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const checkInData = {
      bp: { systolic: systolicBP, diastolic: diastolicBP },
      sugar: bloodSugar,
      symptoms: symptoms,
      mood: mood,
      medication_taken: medicationTaken,
      sleep: sleep,
      appetite: appetite
    };

    try {
      // Submit check-in data
      const response = await fetch(`${API_URL}/users/${name}/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkInData),
      });

      if (response.ok) {
        // Get health analysis
        const analysisResponse = await fetch(`${API_URL}/users/${name}/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (analysisResponse.ok) {
          const data = await analysisResponse.json();
          setAdvice(data.advice);
          setMessage({type: 'success', text: 'Check-in submitted successfully!'});
        }
      } else {
        setMessage({type: 'error', text: 'Failed to submit check-in. Please try again.'});
      }
    } catch (error) {
      setMessage({type: 'error', text: 'Error connecting to server. Please try again.'});
    } finally {
      setLoading(false);
    }
  };

  // Handle user creation
  const handleUserCreated = (userName: string) => {
    setIsLoggedIn(true);
    setIsNewUser(false);
    setName(userName);
    // Save name to localStorage after successful user creation
    localStorage.setItem('goldencare_username', userName);
  };

  // Handle user logout
  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('goldencare_username');
    // Reset state
    setName('');
    setIsLoggedIn(false);
    setIsNewUser(false);
    setAdvice('');
    // Show logout message
    setMessage({type: 'success', text: 'Successfully logged out.'});
  };

  // Available symptom options
  const symptomOptions = [
    'Headache', 'Dizziness', 'Fatigue', 'Joint Pain', 
    'Chest Pain', 'Shortness of Breath', 'Nausea', 
    'Loss of Appetite', 'Fever', 'None'
  ];

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // if (authloading) {
  //   return (
  //     <div className="flex h-screen items-center justify-center text-white">
  //       Loading...
  //     </div>
  //   );
  // }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-gray-950 text-white p-4 relative overflow-hidden">
      <ParticlesBackground/>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-700 opacity-5 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-cyan-700 opacity-5 blur-3xl animate-pulse delay-300"></div>
        <div className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full bg-slate-600 opacity-5 blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.header 
          className="flex items-center justify-between mb-8 mt-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center">
            <div className="bg-blue-500/10 backdrop-blur-md rounded-full p-3 mr-4 border border-blue-500/20">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-200">
              Health Check-In
            </h1>
          </div>
          
          {isLoggedIn && (
            <Button 
              onClick={handleLogout}
              variant="outline" 
              size="sm"
              className="text-slate-300 bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/60 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          )}
        </motion.header>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full mb-4"
            >
              <Alert 
                className={cn(
                  "backdrop-blur-md border transition-all duration-300",
                  message.type === 'success' 
                    ? "bg-green-900/20 border-green-500/30 text-green-100" 
                    : "bg-red-900/20 border-red-500/30 text-red-100"
                )}
              >
                {message.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-400" />
                )}
                <AlertTitle className="font-semibold ml-2">
                  {message.type === 'success' ? 'Success' : 'Error'}
                </AlertTitle>
                <AlertDescription className="ml-6">{message.text}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show name input form if not logged in and not a new user */}
        {!isLoggedIn && !isNewUser ? (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="backdrop-blur-md bg-slate-900/40 border-slate-700/30 shadow-xl overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-slate-100">Welcome to Your Health Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-6">Please enter your name to continue with your daily health check-in.</p>
                <form onSubmit={handleNameSubmit}>
                  <div className="mb-4">
                    <Label htmlFor="name" className="block mb-2 text-slate-300">Enter your name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-blue-500/30 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : 'Continue'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : isNewUser ? (
          // Show CreateUserProfile component if it's a new user
          <CreateUserProfile onUserCreated={handleUserCreated} setMessage={setMessage} />
        ) : (
          // Show health check-in form if user is logged in
          <>
            <motion.h2 
              className="text-2xl font-bold mb-6 text-slate-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              Hello <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">{name}</span>! Let's check in today.
            </motion.h2>
            
            <form onSubmit={handleCheckInSubmit}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="mb-6 backdrop-blur-md bg-slate-900/40 border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 shadow-xl">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-5">
                          <div>
                            <div className="flex items-center mb-2">
                              <Heart className="w-4 h-4 text-red-400 mr-2" />
                              <Label htmlFor="systolicBP" className="text-slate-300">Systolic BP (mmHg)</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                id="systolicBP"
                                type="number"
                                value={systolicBP}
                                onChange={(e) => setSystolicBP(parseInt(e.target.value))}
                                className="text-white flex-grow bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-blue-500/30 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                                required
                              />
                              <Button 
                                type="button" 
                                variant="outline" 
                                className="px-3 text-white bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/80"
                                onClick={() => setSystolicBP(Math.max(0, systolicBP - 1))}
                              >
                                -
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline" 
                                className="px-3 text-white bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/80"
                                onClick={() => setSystolicBP(systolicBP + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center mb-2">
                              <Heart className="w-4 h-4 text-red-400 mr-2" />
                              <Label htmlFor="diastolicBP" className="text-slate-300">Diastolic BP (mmHg)</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                id="diastolicBP"
                                type="number"
                                value={diastolicBP}
                                onChange={(e) => setDiastolicBP(parseInt(e.target.value))}
                                className="flex-grow text-white bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-blue-500/30 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                                required
                              />
                              <Button 
                                type="button" 
                                variant="outline" 
                                className="px-3 text-white bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/80"
                                onClick={() => setDiastolicBP(Math.max(0, diastolicBP - 1))}
                              >
                                -
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline" 
                                className="px-3 text-white bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/80"
                                onClick={() => setDiastolicBP(diastolicBP + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center mb-2">
                              <Droplet className="w-4 h-4 text-blue-400 mr-2" />
                              <Label htmlFor="bloodSugar" className="text-slate-300">Blood Sugar (mg/dL)</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                id="bloodSugar"
                                type="number"
                                value={bloodSugar}
                                onChange={(e) => setBloodSugar(parseInt(e.target.value))}
                                className="flex-grow text-white bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-blue-500/30 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                              />
                              <Button 
                                type="button" 
                                variant="outline" 
                                className="px-3 text-white bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/80"
                                onClick={() => setBloodSugar(Math.max(0, bloodSugar - 1))}
                              >
                                -
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline" 
                                className="px-3 text-white bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/80"
                                onClick={() => setBloodSugar(bloodSugar + 1)}
                              >
                                +
                              </Button> 
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-5">
                          <div>
                            <div className="flex items-center mb-2">
                              <AlertCircle className="w-4 h-4 text-amber-400 mr-2" />
                              <Label htmlFor="symptoms" className="text-slate-300">Any symptoms today?</Label>
                            </div>
                            <Select onValueChange={(value) => setSymptoms([value])}>
                              <SelectTrigger className="w-full text-white bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-blue-500/30 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors">
                                <SelectValue placeholder="Choose an option" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800/95 text-white border-slate-700/50">
                                {symptomOptions.map((symptom) => (
                                  <SelectItem 
                                    key={symptom} 
                                    value={symptom}
                                    className="hover:bg-slate-700/50 text-white focus:bg-slate-700/70 transition-colors"
                                  >
                                    {symptom}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <div className="flex items-center mb-2">
                              <Moon className="w-4 h-4 text-indigo-400 mr-2" />
                              <Label htmlFor="sleep" className="text-slate-300">How did you sleep?</Label>
                            </div>
                            <Select 
                              value={sleep} 
                              onValueChange={setSleep}
                            >
                              <SelectTrigger className="w-full text-white bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-blue-500/30 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors">
                                <SelectValue placeholder="Select sleep quality" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800/95 border-slate-700/50">
                                <SelectItem value="Poor" className="hover:bg-slate-700/50">Poor</SelectItem>
                                <SelectItem value="Fair" className="hover:bg-slate-700/50">Fair</SelectItem>
                                <SelectItem value="Good" className="hover:bg-slate-700/50">Good</SelectItem>
                                <SelectItem value="Excellent" className="hover:bg-slate-700/50">Excellent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <div className="flex items-center mb-2">
                              <BellPlus className="w-4 h-4 text-green-400 mr-2" />
                              <Label htmlFor="appetite" className="text-slate-300">How is your appetite?</Label>
                            </div>
                            <Select 
                              value={appetite} 
                              onValueChange={setAppetite}
                            >
                              <SelectTrigger className="w-full text-white bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-blue-500/30 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors">
                                <SelectValue placeholder="Select appetite" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800/95 border-slate-700/50">
                                <SelectItem value="Poor" className="hover:bg-slate-700/50">Poor</SelectItem>
                                <SelectItem value="Reduced" className="hover:bg-slate-700/50">Reduced</SelectItem>
                                <SelectItem value="Normal" className="hover:bg-slate-700/50">Normal</SelectItem>
                                <SelectItem value="Increased" className="hover:bg-slate-700/50">Increased</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="mood" className="flex items-center mb-2 text-slate-300">
                          <span className="text-sm text-white/60 mr-2">😞</span>
                          How do you feel today?
                          <span className="text-sm text-white/60 ml-2">😊</span>
                        </Label>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-500">1</span>
                          <Slider
                            value={[mood]}
                            min={1}
                            max={5}
                            step={1}
                            onValueChange={(value) => setMood(value[0])}
                            className="flex-grow [&>div>div]:bg-gradient-to-r [&>div>div]:from-blue-500 [&>div>div]:to-cyan-500"
                          />
                          <span className="text-sm text-slate-500">5</span>
                        </div>
                        <div className="flex justify-between mt-1 text-slate-500 text-xs">
                          <span>Poor</span>
                          <span>Average</span>
                          <span>Excellent</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
                        <Label htmlFor="medication" className="text-slate-300 flex items-center">
                          <span className="w-8 h-8 mr-3 flex items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20">
                            <span className="text-blue-400 text-sm">Rx</span>
                          </span>
                          Medication taken today?
                        </Label>
                        <Switch 
                          id="medication"
                          checked={medicationTaken}
                          onCheckedChange={setMedicationTaken}
                          className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-slate-700"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 py-6 text-lg"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : 'Submit Your Health Report'}
                      </Button>
                      
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </form>

            <AnimatePresence>
              {advice && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Card className="mb-6 backdrop-blur-md bg-gradient-to-br from-blue-950/40 to-slate-900/40 border-blue-700/20 shadow-xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-slate-100 flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20">
                          <Activity className="h-4 w-4 text-blue-400" />
                        </div>
                        Today's Health Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 leading-relaxed">{advice}</p>
                    </CardContent>
                  </Card>
                  <div className='flex flex-row items-center justify-center'>
                     <Button className='bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 shadow-lg hover:shadow-amber-500/20 transition-all duration-300 py-6 text-white'>
                   <Link href={"/Healthmate?category=biopsy"}>Go To Chatbot</Link>
                  </Button>
                  </div>
                 
                </motion.div>
              )}
            </AnimatePresence>
            
          </>
        )}
      </div>
    </div>
  );
};

export default HealthCheckInPage;
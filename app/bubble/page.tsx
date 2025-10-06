"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

import CustomCursor from '@/components/shared/custom-cursor';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameProfile from "@/components/gamezone/GameProfile";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  hue: number;
  wobble: number;
  wobbleSpeed: number;
  wobbleAmount: number;
  isRed?: boolean;
  timeAsRed?: number;
  startTime: number;
}

export default function BubblePage() {
  // Base game constants
  const BASE_SPEED = 0.05;
  const BASE_RED_BUBBLE_INTERVAL = 2500;
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [missedRedBubbles, setMissedRedBubbles] = useState(0);
  const [showRedBubbleMessage, setShowRedBubbleMessage] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const nextId = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const lastBubbleTime = useRef(0);
  const lastRedBubbleTime = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameStartTime = useRef(0);
  const bubblesRef = useRef<Bubble[]>([]);
  bubblesRef.current = bubbles;

  // First useEffect: Handle mounting state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Second useEffect: Check user authentication
  // useEffect(() => {
  //   if (!mounted) return;

  //   const base = process.env.NEXT_PUBLIC_API_URL;
  //   axios
  //     .get(`${base}/auth/user`, {
  //       withCredentials: true,
  //     })
  //     .then((res) => {
  //       setUser(res.data.user);
  //       setLoading(false);
  //     })
  //     .catch(() => {
  //       setUser(null);
  //       setLoading(false);
  //       router.push("/signup");
  //     });
  // }, [router, mounted]);

  // Third useEffect: Load high score (client-only)
  useEffect(() => {
    if (!mounted) return;

    try {
      const saved = localStorage.getItem('bubbleGameHighScore');
      if (saved) {
        setHighScore(parseInt(saved, 10));
      }
    } catch (error) {
      console.error('Failed to load high score:', error);
    }
  }, [mounted]);

  // Level-up logic
  useEffect(() => {
    if (score >= 7) {
      const newLevel = Math.floor((score - 7) / 3) + 2;
      if (newLevel > level) {
        setLevel(newLevel);
      }
    }
  }, [score, level]);

  // Create a bubble - only call this client-side
  const createBubble = useCallback((): Bubble => {
    if (typeof window === 'undefined') {
      // Return a dummy bubble for SSR (won't be used)
      return {
        id: 0,
        x: 0,
        y: 0,
        size: 40,
        speed: BASE_SPEED,
        opacity: 0.5,
        hue: 180,
        wobble: 0,
        wobbleSpeed: 0.003,
        wobbleAmount: 1,
        isRed: false,
        startTime: 0
      };
    }

    const currentSpeed = BASE_SPEED * Math.pow(1.1, level - 1);
    
    return {
      id: nextId.current++,
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 50,
      size: Math.random() * 60 + 20,
      speed: currentSpeed + (Math.random() * 0.02),
      opacity: Math.random() * 0.6 + 0.4,
      hue: Math.random() * 60 + 180,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.005 + 0.001,
      wobbleAmount: Math.random() * 1.5 + 0.5,
      isRed: false,
      startTime: Date.now()
    };
  }, [level, BASE_SPEED]);

  const makeRandomBubbleRed = useCallback(() => {
    const normalBubbles = bubblesRef.current.filter(b => !b.isRed);
    if (normalBubbles.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * normalBubbles.length);
    const bubbleToTurnRed = normalBubbles[randomIndex];
    
    setBubbles(prev => prev.map(bubble => 
      bubble.id === bubbleToTurnRed.id 
        ? { ...bubble, isRed: true, timeAsRed: Date.now() }
        : bubble
    ));
  }, []);

  const popBubble = useCallback((id: number) => {
    const poppedBubble = bubblesRef.current.find(bubble => bubble.id === id);
    if (poppedBubble?.isRed && gameActive) {
      setScore(prev => {
        const newScore = prev + 1;
        if (newScore > highScore && mounted) {
          setHighScore(newScore);
          try {
            localStorage.setItem('bubbleGameHighScore', newScore.toString());
          } catch (error) {
            console.error('Failed to save high score:', error);
          }
        }
        return newScore;
      });
    }
    setBubbles(prev => prev.filter(bubble => bubble.id !== id));
  }, [gameActive, highScore, mounted]);

  const startGame = useCallback(() => {
    setGameActive(true);
    setTimeLeft(20);
    setScore(0);
    setLevel(1);
    setMissedRedBubbles(0);
    lastRedBubbleTime.current = Date.now();
    gameStartTime.current = Date.now();
    setShowRedBubbleMessage(true);
    
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  }, []);

  const updateTimer = useCallback(() => {
    if (!gameActive) return;
    
    const now = Date.now();
    const elapsed = now - gameStartTime.current;
    const remaining = Math.max(0, 20000 - elapsed);
    
    setTimeLeft(Math.ceil(remaining / 1000));
    
    if (remaining <= 0) {
      setGameActive(false);
      setShowRedBubbleMessage(false);
    }
  }, [gameActive]);

  const updateBubbles = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const now = Date.now();
    
    if (now - lastBubbleTime.current > 400) {
      setBubbles(prev => [...prev, createBubble()]);
      lastBubbleTime.current = now;
    }

    const redBubbleInterval = Math.max(500, BASE_RED_BUBBLE_INTERVAL / (1 + (level - 1) * 2));
    
    if (gameActive && now - lastRedBubbleTime.current > redBubbleInterval) {
      makeRandomBubbleRed();
      lastRedBubbleTime.current = now;
    }

    updateTimer();

    setBubbles(prev => {
      let missedRedInThisFrame = 0;
      
      const updatedBubbles = prev.reduce((acc, bubble) => {
        const elapsed = now - bubble.startTime;
        const progress = elapsed * bubble.speed / 1000;
        const y = window.innerHeight - progress * (window.innerHeight + bubble.size);
        
        if (y < -bubble.size) {
          if (bubble.isRed && gameActive) {
            missedRedInThisFrame++;
          }
          return acc;
        }
        
        const xOffset = Math.sin(bubble.wobble) * bubble.wobbleAmount;
        
        return [
          ...acc,
          {
            ...bubble,
            y,
            x: bubble.x + xOffset,
            wobble: bubble.wobble + bubble.wobbleSpeed
          }
        ];
      }, [] as Bubble[]);

      if (missedRedInThisFrame > 0) {
        setMissedRedBubbles(prev => prev + missedRedInThisFrame);
      }

      return updatedBubbles;
    });

    animationFrameId.current = requestAnimationFrame(updateBubbles);
  }, [createBubble, makeRandomBubbleRed, gameActive, updateTimer, level, BASE_RED_BUBBLE_INTERVAL]);

  // Initialize bubbles only on client-side after mount
  useEffect(() => {
    if (!mounted) return;
    
    const initialBubbles = Array(5).fill(0).map(() => createBubble());
    setBubbles(initialBubbles);

    animationFrameId.current = requestAnimationFrame(updateBubbles);
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [mounted, createBubble, updateBubbles]);

  const getBubbleStyle = useCallback((bubble: Bubble) => {
    const baseStyle = {
      width: `${bubble.size}px`,
      height: `${bubble.size}px`,
      opacity: bubble.opacity,
      transform: 'translate3d(-50%, -50%, 0)',
      willChange: 'transform, opacity',
      transition: 'transform 0.2s ease-out, opacity 0.2s ease-out'
    };

    if (bubble.isRed) {
      return {
        ...baseStyle,
        background: `radial-gradient(circle at 30% 30%, 
          hsla(0, 90%, 75%, 0.9) 0%, 
          hsla(0, 80%, 65%, 0.7) 30%, 
          hsla(0, 70%, 55%, 0.5) 60%, 
          hsla(0, 60%, 45%, 0.8) 100%)`,
        border: `2px solid hsla(0, 80%, 90%, 0.8)`,
        boxShadow: `
          inset 0 0 ${bubble.size * 0.3}px hsla(0, 90%, 95%, 0.6),
          inset ${bubble.size * 0.1}px ${bubble.size * 0.1}px ${bubble.size * 0.2}px hsla(0, 80%, 80%, 0.4),
          0 ${bubble.size * 0.1}px ${bubble.size * 0.3}px rgba(255, 0, 0, 0.4),
          0 0 ${bubble.size * 0.5}px rgba(255, 0, 0, 0.3)
        `,
      };
    }
    
    return {
      ...baseStyle,
      background: `radial-gradient(circle at 30% 30%, 
        hsla(${bubble.hue}, 70%, 85%, 0.9) 0%, 
        hsla(${bubble.hue + 20}, 60%, 75%, 0.7) 30%, 
        hsla(${bubble.hue}, 50%, 65%, 0.5) 60%, 
        hsla(${bubble.hue - 10}, 40%, 55%, 0.8) 100%)`,
      border: `1px solid hsla(${bubble.hue}, 60%, 90%, 0.6)`,
      boxShadow: `
        inset 0 0 ${bubble.size * 0.3}px hsla(${bubble.hue}, 80%, 95%, 0.6),
        inset ${bubble.size * 0.1}px ${bubble.size * 0.1}px ${bubble.size * 0.2}px hsla(${bubble.hue}, 60%, 80%, 0.4),
        0 ${bubble.size * 0.1}px ${bubble.size * 0.3}px rgba(0, 0, 0, 0.3)
      `,
    };
  }, []);

  const redBubblesOnScreen = bubbles.filter(b => b.isRed).length;

  // Show loading state until mounted
  if (!mounted) {
    return <div className="w-full h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-black" />;
  }

  // if (loading) {
  //   return (
  //     <div className="flex h-screen items-center justify-center text-white">
  //       Loading...
  //     </div>
  //   );
  // }

  return (
    <div 
      className="relative w-full h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-black overflow-hidden"
      ref={containerRef}
    >
      <CustomCursor containerRef={containerRef} />
      
      <div className="absolute inset-0 opacity-10">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              top: `${(i * 12.5) % 100}%`,
              left: `${(i * 15) % 100}%`,
              width: `${(i % 3) + 1}px`,
              height: `${(i % 3) + 1}px`,
              animationDuration: `${(i % 3) + 2}s`
            }}
          />
        ))}
      </div>

      {!gameActive && <GameProfile user={user} />}

      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 text-center">
        <h1 className="text-3xl font-bold text-white tracking-wide">
          {gameActive ? "Pop the Red Bubbles!" : "Bubble Pop Game"}
        </h1>
        
        <div className="mt-2 p-3 bg-none bg-opacity-30 rounded-lg backdrop-blur-sm">
          <p className="text-gray-200 text-lg font-medium">
            {gameActive 
              ? `Time: ${timeLeft}s | Score: ${score} | Level: ${level} | High: ${highScore}` 
              : ""}
          </p>
          
          {gameActive && (
            <div className="text-red-300 mt-1 space-y-1 flex justify-center gap-4">
              <p className="px-2 py-1 bg-red-900 bg-opacity-30 rounded">
                Missed: {missedRedBubbles}
              </p>
              <p className="px-2 py-1 bg-red-500 bg-opacity-30 rounded">
                Red bubbles: {redBubblesOnScreen}
              </p>
              <p className="px-2 py-1 bg-blue-500 bg-opacity-30 rounded">
                Speed: {Math.round((BASE_SPEED * Math.pow(1.1, level - 1)) * 1000)}%
              </p>
            </div>
          )}
        </div>
        
        {!gameActive && (
          <button 
            onClick={startGame}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            Start Game
          </button>
        )}
      </div>

      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute cursor-pointer transform-gpu will-change-transform"
          style={{
            left: `${bubble.x}px`,
            top: `${bubble.y}px`,
            transition: 'transform 0.1s ease-out',
          }}
          onClick={() => popBubble(bubble.id)}
        >
          <div
            className="relative w-full h-full rounded-full transform-gpu will-change-transform"
            style={getBubbleStyle(bubble)}
          >
            <div
              className="absolute rounded-full will-change-transform"
              style={{
                top: '15%',
                left: '25%',
                width: '35%',
                height: '35%',
                background: `radial-gradient(circle, 
                  rgba(255, 255, 255, 0.8) 0%, 
                  rgba(255, 255, 255, 0.4) 50%, 
                  transparent 100%)`,
                filter: 'blur(1px)'
              }}
            />
            <div
              className="absolute rounded-full will-change-transform"
              style={{
                top: '60%',
                right: '20%',
                width: '20%',
                height: '20%',
                background: `radial-gradient(circle, 
                  rgba(255, 255, 255, 0.5) 0%, 
                  rgba(255, 255, 255, 0.2) 60%, 
                  transparent 100%)`,
                filter: 'blur(0.5px)'
              }}
            />
            <div
              className="absolute inset-0 rounded-full will-change-transform"
              style={{
                background: `conic-gradient(from 45deg, 
                  transparent 0deg,
                  hsla(${bubble.isRed ? 40 : bubble.hue + 40}, 80%, 90%, 0.6) 60deg,
                  hsla(${bubble.isRed ? 80 : bubble.hue + 80}, 70%, 85%, 0.4) 120deg,
                  transparent 180deg,
                  hsla(${bubble.isRed ? -20 : bubble.hue - 20}, 60%, 80%, 0.3) 240deg,
                  transparent 360deg)`,
                mask: `radial-gradient(circle, transparent 85%, black 90%, black 95%, transparent 100%)`
              }}
            />
            
            {bubble.isRed && (
              <div
                className="absolute inset-0 rounded-full animate-ping will-change-transform"
                style={{
                  background: 'rgba(255, 0, 0, 0.2)',
                  animationDuration: '2s'
                }}
              />
            )}
          </div>
        </div>
      ))}

      {!gameActive && score > 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  bg-white/10 backdrop-blur-xl shadow-2xl p-8 rounded-2xl text-center 
                  transition-transform duration-500 hover:scale-105 hover:bg-white/20 
                  border border-white/20">
          <h2 className="text-3xl font-extrabold text-white mb-4 drop-shadow-lg">Game Over!</h2>
          <p className="text-2xl text-white/90 mb-1">Your Score: <span className="font-semibold">{score}</span></p>
          <p className="text-xl text-white/80 mb-1">Level Reached: <span className="font-semibold text-yellow-400">Level {level}</span></p>
          <p className="text-xl text-white/80">High Score: <span className="font-semibold">{highScore}</span></p>
          <p className="text-lg text-red-400 mt-3 font-medium">Missed Red Bubbles: {missedRedBubbles}</p>
          <div className="mt-4 text-sm text-gray-300">
            <p>Final Speed: {Math.round((BASE_SPEED * Math.pow(1.1, level - 1)) * 1000)}% of base</p>
            <p>Red Bubble Interval: {Math.round(BASE_RED_BUBBLE_INTERVAL / (1 + (level - 1) * 2))}ms</p>
          </div>
        </div>
      )}

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-gray-400 text-sm">
          {gameActive 
            ? "Pop as many red bubbles as you can in 20 seconds! Watch for bubbles turning red!" 
            : "Bubbles float up gently • Red bubbles are worth points • Don't let them escape!"}
        </p>
      </div>
    </div>
  );
}

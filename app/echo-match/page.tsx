"use client";
import axios from "axios";
import { useRouter } from "next/navigation";

import { useEffect, useRef, useState } from "react";
import { emotionAudios, EmotionType } from "./helper/emotionAudios";
import CustomCursor from "@/components/shared/custom-cursor";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Slider } from "@/components/ui/slider";

const emotions: EmotionType[] = [
  "Happy",
  "Sad",
  "Love",
  "Romantic",
  "Heartbreak",
  "Motivational",
  "Chill",
  "Angry",
  "Party",
];

export default function GamePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerRef = useRef<any>(null);

  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [correctEmotion, setCorrectEmotion] = useState<EmotionType | null>(
    null
  );
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(
    null
  );
  const [result, setResult] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const [volume, setVolume] = useState(1);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const startGame = () => {
    setResult(null);
    setSelectedEmotion(null);
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const audios = emotionAudios[randomEmotion];
    const randomAudio = audios[Math.floor(Math.random() * audios.length)];
    setIsPlaying(true);
    setCorrectEmotion(randomEmotion);
    setCurrentAudio(randomAudio);
    setStartTime(null); // reset
    setResponseTime(null);
  };

  const handlePlayAgain = () => {
    setShowPlayAgain(false);
    let seconds = 3;
    setCountdown(seconds);
    const interval = setInterval(() => {
      seconds -= 1;
      setCountdown(seconds);
      if (seconds === 0) {
        clearInterval(interval);
        setCountdown(null);
        startGame();
      }
    }, 1000);
  };
  const handleSelection = (emotion: EmotionType) => {
    setSelectedEmotion(emotion);

    if (startTime !== null) {
      const timeTaken = Date.now() - startTime; // ⏱️ in ms
      setResponseTime(timeTaken);
      console.log(`⏱️ Response time: ${timeTaken}ms`);
    }

    if (emotion === correctEmotion) {
      setResult("✅ Correct!");
    } else {
      setResult(`❌ Wrong! It was ${correctEmotion}`);
    }

    setShowPlayAgain(true);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/auth/user", {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
        router.push("/signup");
      });
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-black overflow-hidden flex items-center justify-center flex-col px-4 py-9"
    >
      <CustomCursor containerRef={containerRef} />
      <>
        {Array.from({ length: 20 }).map((_, i) => (
          <MusicalNote
            key={i}
            top={`${Math.random() * 100}%`}
            left={`${Math.random() * 100}%`}
            size={20 + Math.random() * 30}
            color={["#f472b6", "#60a5fa", "#facc15", "#34d399"][i % 4]}
            delay={Math.random() * 2}
          />
        ))}
      </>

      <motion.h1
        className="text-4xl font-extrabold mb-6 text-center text-white tracking-wide"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🎧 Echo Match
      </motion.h1>

      {!currentAudio && (
        <motion.button
          onClick={startGame}
          className="mb-6 px-8 py-3 bg-blue-600 rounded-xl text-white text-lg font-medium shadow-md hover:bg-blue-700 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start
        </motion.button>
      )}

      <AnimatePresence>
        {countdown !== null && (
          <motion.div
            key="overlay"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-white">Starts in</h1>
            <motion.div
              key={countdown}
              className="text-white text-[80px] font-extrabold"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              {countdown}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {currentAudio && (
        <motion.div
          className="mb-6 text-center flex flex-col items-center gap-6 w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-lg text-white">
            🔊 Listen to the audio and select the emotion:
          </p>

          {/* Spinning Disc */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <Image
              src="/cd-png.png"
              alt="disc"
              width={160}
              height={160}
              className={`animate-spin-slow pointer-events-none ${
                isPlaying && "animate-spin-slow"
              }`}
            />
          </div>

          {/* Audio Player */}
          <AudioPlayer
            ref={playerRef}
            autoPlay
            src={currentAudio}
            showJumpControls={false}
            onPlay={() => {
              setStartTime(Date.now());
            }}
            layout="horizontal"
            className="!bg-slate-700 !text-white !border-none !rounded-xl"
          />

          {/* Volume Slider */}
          <div className="w-full max-w-sm">
            <label className="text-white text-sm mb-1 block">Volume</label>
            <Slider
              defaultValue={[volume]}
              value={[volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={(value) => {
                const newVolume = value[0];
                if (playerRef.current?.audio?.current) {
                  playerRef.current.audio.current.volume = newVolume;
                }
                setVolume(newVolume);
              }}
              className="w-full"
            />
            <div className="text-xs text-white mt-1 text-right">
              {Math.round(volume * 100)}%
            </div>
          </div>
        </motion.div>
      )}

      {currentAudio && (
        <div className="flex space-x-4 mt-2 flex-wrap justify-center">
          {emotions.map((emotion) => (
            <motion.button
              key={emotion}
              onClick={() => handleSelection(emotion)}
              disabled={selectedEmotion !== null}
              className={`px-6 py-3 rounded-xl text-black text-lg font-semibold shadow-md transition-all ${
                selectedEmotion === emotion
                  ? emotion === correctEmotion
                    ? "bg-green-400"
                    : "bg-red-400"
                  : "bg-yellow-300 hover:bg-yellow-400"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
            >
              {emotion}
            </motion.button>
          ))}
        </div>
      )}
      {responseTime !== null && (
        <div className="text-white text-sm mt-2">
          ⏱️ Response Time: {(responseTime / 1000).toFixed(2)}s
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-2xl font-semibold text-white mb-4">
              {result}
            </div>
            {showPlayAgain && (
              <button
                onClick={handlePlayAgain}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-medium rounded-xl shadow"
              >
                🔁 Play Again
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
function MusicalNote({
  top,
  left,
  size,
  color,
  delay = 0,
}: {
  top: string;
  left: string;
  size: number;
  color: string;
  delay?: number;
}) {
  return (
    <motion.svg
      className="absolute opacity-30"
      style={{ top, left, width: size, height: size, color }}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      initial={{ y: -10 }}
      animate={{ y: 10 }}
      transition={{
        repeat: Infinity,
        duration: 3,
        repeatType: "reverse",
        delay,
      }}
    >
      <path d="M9 3v12a4 4 0 1 1-2-3.465V6h8V3H9z" />
    </motion.svg>
  );
}

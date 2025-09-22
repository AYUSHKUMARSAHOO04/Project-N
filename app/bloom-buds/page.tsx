'use client';

import axios from "axios";
import { useRouter } from "next/navigation";

import CustomCursor from '@/components/shared/custom-cursor';
import { useEffect, useRef, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerTrigger,
} from "@/components/ui/drawer";

import { History } from 'lucide-react';
type Bud = {
    id: number;
    isActive: boolean;
    isBloomed: boolean;
    activatedAt: number | null;
};

const GRID_SIZE = 24;
const ACTIVATION_INTERVAL = 1500;
const ACTIVE_DURATION = 2000;
const GAME_DURATION = 30;

export default function BloomGame() {
  //20.0
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const containerRef = useRef<HTMLDivElement>(null);
    const [buds, setBuds] = useState<Bud[]>([]);
    const [tapCount, setTapCount] = useState(0);
    const [bloomCount, setBloomCount] = useState(0);
    const [missedTaps, setMissedTaps] = useState(0);
    const [reactionTimes, setReactionTimes] = useState<number[]>([]);
    const [wrongTaps, setWrongTaps] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [isGameOver, setIsGameOver] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [highScore, setHighScore] = useState<any>(null);
    const [history, setHistory] = useState<any>(null);
    const playTap = useSound('/sounds/tap-sound.mp3');
    const playCorrect = useSound('/sounds/correct-tap.mp3');
    const playMiss = useSound('/sounds/wrong-tap.mp3');
    const playGameOver = useSound('/sounds/game-over.mp3');

    //20.1
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

  

    useEffect(() => {
        const stored = localStorage.getItem('bloomGameBestStats');
        const allHistory = localStorage.getItem('bloomGameHistory');
        if (stored) setHighScore(JSON.parse(stored));
    }, []);

    useEffect(() => {
        const initialBuds = Array.from({ length: GRID_SIZE }, (_, i) => ({
            id: i,
            isActive: false,
            isBloomed: false,
            activatedAt: null,
        }));
        setBuds(initialBuds);
    }, []);

    useEffect(() => {
        if (!hasStarted || isGameOver) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    playGameOver();
                    setIsGameOver(true);
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [hasStarted, isGameOver]);

    // set the minimum response time
    useEffect(() => {
        if (isGameOver) {
            const currentAvgTime =
                reactionTimes.length > 0
                    ? Math.round(reactionTimes.reduce((a, b) => a + b) / reactionTimes.length)
                    : 0;

            const stats = {
                tapCount,
                bloomCount,
                missedTaps,
                wrongTaps,
                averageReactionTime: currentAvgTime,
                date: new Date().toISOString(),
            };

            // Save last stats
            const history = JSON.parse(localStorage.getItem('bloomGameHistory') || '[]');
            const updatedHistory = [stats, ...history];
            const limitedHistory = updatedHistory.slice(0, 10);

            // history
            localStorage.setItem('bloomGameHistory', JSON.stringify(limitedHistory));

            // Compare to best score
            const bestStats = JSON.parse(localStorage.getItem('bloomGameBestStats') || 'null');
            if (!bestStats || currentAvgTime < bestStats.averageReactionTime) {
                localStorage.setItem('bloomGameBestStats', JSON.stringify(stats));
            }
        }
    }, [isGameOver]);


    useEffect(() => {
        if (!hasStarted || isGameOver) return;

        const interval = setInterval(() => {
            const index = Math.floor(Math.random() * GRID_SIZE);
            setBuds(prev =>
                prev.map((bud, i) =>
                    i === index && !bud.isBloomed
                        ? { ...bud, isActive: true, activatedAt: Date.now() }
                        : bud
                )
            );

            setTimeout(() => {
                setBuds(prev =>
                    prev.map((bud, i) => {
                        if (i === index && bud.isActive && !bud.isBloomed) {
                            setMissedTaps(pre => pre + 1);
                            return { ...bud, isActive: false, activatedAt: null };
                        } else if (i === index) {
                            return { ...bud, isActive: false, activatedAt: null };
                        }
                        return bud;
                    })
                );
            }, ACTIVE_DURATION);
        }, ACTIVATION_INTERVAL);

        return () => clearInterval(interval);
    }, [hasStarted, isGameOver]);

    const handleTap = (bud: Bud) => {
        if (isGameOver || !hasStarted) return;

        playTap();
        setTapCount(c => c + 1);

        if (bud.isActive && !bud.isBloomed) {
            const reactionTime = bud.activatedAt ? Date.now() - bud.activatedAt : 0;
            playCorrect();
            setReactionTimes(prev => [...prev, reactionTime]);

            setBuds(prev =>
                prev.map(b =>
                    b.id === bud.id
                        ? { ...b, isBloomed: true, isActive: false }
                        : b
                )
            );
            setBloomCount(c => c + 1);
        } else {
            playMiss();
            setWrongTaps(prev => prev + 1);
        }
    };

    const averageReactionTime =
        reactionTimes.length > 0
            ? Math.round(reactionTimes.reduce((a, b) => a + b) / reactionTimes.length)
            : 0;

    const handleStart = () => {
        setHasStarted(true);
        setTimeLeft(GAME_DURATION);
        setTapCount(0);
        setBloomCount(0);
        setMissedTaps(0);
        setWrongTaps(0);
        setReactionTimes([]);
        setIsGameOver(false);

        // Reset all buds
        setBuds(prev =>
            prev.map(bud => ({
                ...bud,
                isActive: false,
                isBloomed: false,
                activatedAt: null
            }))
        );
    };
    const handleRestartGame = () => {
        window.location.reload();
    };

    //20.2
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
            <div className='absolute top-8 right-5 md:right-10'>

                <HistoryDrawer />
            </div>
            {!hasStarted ? (
                <div className="text-center space-y-6">
                    <h1 className="text-4xl font-bold text-white">🌸 Bloom the Buds</h1>
                    <p className="text-lg text-gray-300">Test your reflexes by blooming as many buds as you can in 30 seconds!</p>
                    <button
                        onClick={handleStart}
                        className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-lg font-semibold transition-all"
                    >
                        Start Game
                    </button>
                </div>
            ) : (
                <>
                    <h1 className="text-4xl font-bold text-white mb-2">🌸 Bloom the Buds</h1>
                    <div className="text-xl font-semibold text-white mb-4">
                        ⏳ Time Left: {timeLeft}s
                    </div>

                    {isGameOver && (
                        <div className="text-center text-red-600 text-2xl font-bold mt-4">
                            ⛔ Game Over
                        </div>
                    )}

                    <div className=" flex items-center justify-cente my-5">
                        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-6 md:gap-6 p-6 rounded-2xl border border-purple-600 bg-gradient-to-br from-[#1f1b2e] via-[#2c223f] to-[#1a162a] shadow-[inset_0_0_12px_#6b21a8] backdrop-blur-md transition-all duration-300">

                            {buds.map((bud) => (
                                <img
                                    key={bud.id}
                                    src={
                                        bud.isBloomed
                                            ? '/bloom-buds-img/bloom.png'
                                            : bud.isActive
                                                ? '/bloom-buds-img/active-buds.png'
                                                : '/bloom-buds-img/bud-img.png'
                                    }
                                    alt="bud"
                                    onClick={() => handleTap(bud)}
                                    className={`
                                    w-14 sm:w-16 h-14 sm:h-16 cursor-pointer transition-all duration-200
                                    ${bud.isActive && !bud.isBloomed ? 'hover:scale-110 animate-ping-slow drop-shadow-glow' : ''}
                                    ${!bud.isActive && !bud.isBloomed ? 'grayscale opacity-50' : ''}
                                `}
                                />
                            ))}
                        </div>
                    </div>
                    <Dialog open={isGameOver}>
                        <DialogContent className="bg-gradient-to-br from-[#1f1b2e] via-[#2c223f] to-[#1a162a] text-white border border-purple-700 shadow-xl rounded-2xl p-6 w-full max-w-md backdrop-blur-md">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-center text-purple-300 mb-2">
                                    🎮 Game Over – Your Score
                                </DialogTitle>
                                <DialogDescription className="text-sm space-y-2 text-purple-100 flex items-center flex-col justify-center">
                                    <p><strong>🌼 Tap Count:</strong> {tapCount}</p>
                                    <p><strong>✅ Bloomed:</strong> {bloomCount}</p>
                                    <p><strong>🚫 Missed Taps:</strong> {missedTaps}</p>
                                    <p><strong>❌ Wrong Taps:</strong> {wrongTaps}</p>
                                    <p><strong>⚡ Avg Reaction Time:</strong> {averageReactionTime} ms</p>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="mt-6 flex justify-center">
                                <button
                                    onClick={handleRestartGame}
                                    className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all duration-300 shadow-md"
                                >
                                    🔁 Play Again
                                </button>
                            </div>
                        </DialogContent>
                    </Dialog>

                </>
            )}
        </div>
    );
}

const useSound = (src: string) => {
    const play = () => {
        const audio = new Audio(src);
        audio.play();
    };
    return play;
};


interface GameSession {
  date: string;
  tapCount: number;
  bloomCount: number;
  missedTaps: number;
  wrongTaps: number;
  averageReactionTime: number;
}

 function HistoryDrawer() {
  const [history, setHistory] = useState<GameSession[]>([]);
  const [bestScore, setBestScore] = useState<GameSession | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = JSON.parse(localStorage.getItem('bloomGameHistory') || '[]');
      const highScore = JSON.parse(localStorage.getItem('bloomGameBestStats') || 'null');
      setHistory(stored);
      setBestScore(highScore);
    }
  }, []);

  return (
    <Drawer>
      <DrawerTrigger title='History'>
        <History className='size-7' />
      </DrawerTrigger>

      <DrawerContent className="bg-gradient-to-br from-[#1f1b2e] via-[#2c223f] to-[#1a162a] text-white border-t border-purple-700">
        <DrawerHeader>
          <DrawerTitle className="text-purple-300 text-xl">🎮 Game History</DrawerTitle>
          <DrawerDescription className="text-gray-400">
            Here's your performance in past sessions:
          </DrawerDescription>
        </DrawerHeader>

        {bestScore && bestScore.date && (
          <div className="border border-pink-400 bg-[#3b2a3f] text-pink-200 rounded-2xl p-5 shadow-[0_0_20px_rgba(244,114,182,0.1)] mb-4 mx-4 flex items-center gap-4">
            <div className="text-4xl md:text-8xl leading-none pt-1">🏆</div>
            <div className="flex-1">
              <p className="text-sm text-pink-300 font-semibold mb-3">
                Best Performance — {new Date(bestScore.date).toLocaleString()}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-1 gap-x-4 text-sm">
                <StatItem label="🌼 Tap" value={bestScore.tapCount} />
                <StatItem label="✅ Bloomed" value={bestScore.bloomCount} />
                <StatItem label="🚫 Missed" value={bestScore.missedTaps} />
                <StatItem label="❌ Wrong" value={bestScore.wrongTaps} />
                <StatItem label="⚡ Avg Reaction Time" value={`${bestScore.averageReactionTime} ms`} span />
              </div>
            </div>
          </div>
        )}

        {history.length === 0 ? (
          <p className="text-center text-sm text-gray-400 mt-6">No games played yet.</p>
        ) : (
          <div className="px-4 pb-6 space-y-4 overflow-y-scroll">
            {history.map((session, i) => (
              <div
                key={i}
                className="border border-purple-700 bg-[#241c35] rounded-xl p-4 shadow-md"
              >
                <p className="text-sm text-gray-300 mb-2">
                  📅 {new Date(session.date).toLocaleString()}
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <StatItem label="🌼 Tap" value={session.tapCount} />
                  <StatItem label="✅ Bloomed" value={session.bloomCount} />
                  <StatItem label="🚫 Missed" value={session.missedTaps} />
                  <StatItem label="❌ Wrong" value={session.wrongTaps} />
                  <StatItem label="⚡ Avg Time" value={`${session.averageReactionTime} ms`} span />
                </div>
              </div>
            ))}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}

function StatItem({ label, value, span = false }: { label: string, value: string | number, span?: boolean }) {
  return (
    <div className={`flex items-center gap-1 ${span ? "col-span-2 sm:col-span-3" : ""}`}>
      {label}: <span>{value}</span>
    </div>
  );
}

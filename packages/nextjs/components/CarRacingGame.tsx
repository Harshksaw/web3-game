"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowPathIcon, PlayIcon, TrophyIcon } from "@heroicons/react/24/outline";

interface GameState {
  isPlaying: boolean;
  gameOver: boolean;
  score: number;
  highScore: number;
  tokensEarned: number;
}

interface Car {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

interface Coin {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  collected: boolean;
}

const CarRacingGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const coinsRef = useRef<Coin[]>([]);
  const carRef = useRef<Car>({ x: 280, y: 400, width: 45, height: 70 });

  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    gameOver: false,
    score: 0,
    highScore: 0,
    tokensEarned: 0,
  });

  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});

  const gameWidth = 600;
  const gameHeight = 500;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHighScore = localStorage.getItem("carGameHighScore");
      if (savedHighScore) {
        setGameState(prev => ({ ...prev, highScore: parseInt(savedHighScore) }));
      }
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setKeys(prev => ({ ...prev, [e.key]: true }));
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setKeys(prev => ({ ...prev, [e.key]: false }));
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const checkCollision = (rect1: Car | Coin, rect2: Obstacle | Car) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  const spawnObstacle = (): Obstacle => {
    const lanes = [80, 160, 240, 320, 400, 480];
    const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
    return {
      x: randomLane,
      y: -80,
      width: 45,
      height: 70,
      speed: 3 + Math.random() * 2,
    };
  };

  const spawnCoin = (): Coin => {
    const lanes = [100, 180, 260, 340, 420, 500];
    const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
    return {
      x: randomLane,
      y: -25,
      width: 25,
      height: 25,
      speed: 2 + Math.random(),
      collected: false,
    };
  };

  const gameLoop = useCallback(() => {
    if (!gameState.isPlaying || gameState.gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Update car position
    if (keys["ArrowLeft"] && carRef.current.x > 60) {
      carRef.current.x -= 6;
    }
    if (keys["ArrowRight"] && carRef.current.x < gameWidth - 110) {
      carRef.current.x += 6;
    }

    // Update obstacles
    obstaclesRef.current = obstaclesRef.current
      .map(obstacle => ({
        ...obstacle,
        y: obstacle.y + obstacle.speed,
      }))
      .filter(obstacle => obstacle.y < gameHeight + 100);

    // Spawn new obstacles
    if (Math.random() < 0.02) {
      obstaclesRef.current.push(spawnObstacle());
    }

    // Update coins
    coinsRef.current = coinsRef.current
      .map(coin => ({
        ...coin,
        y: coin.y + coin.speed,
      }))
      .filter(coin => coin.y < gameHeight + 50 && !coin.collected);

    // Spawn new coins
    if (Math.random() < 0.015) {
      coinsRef.current.push(spawnCoin());
    }

    // Check collisions with obstacles
    obstaclesRef.current.forEach(obstacle => {
      if (checkCollision(carRef.current, obstacle)) {
        setGameState(prev => {
          const newHighScore = Math.max(prev.score, prev.highScore);
          if (typeof window !== "undefined") {
            localStorage.setItem("carGameHighScore", newHighScore.toString());
          }
          return {
            ...prev,
            gameOver: true,
            highScore: newHighScore,
          };
        });
        return;
      }
    });

    // Check collisions with coins
    coinsRef.current = coinsRef.current.map(coin => {
      if (!coin.collected && checkCollision(carRef.current, coin)) {
        setGameState(prev => ({
          ...prev,
          score: prev.score + 10,
          tokensEarned: prev.tokensEarned + 0.001,
        }));
        return { ...coin, collected: true };
      }
      return coin;
    });

    // Clear canvas
    ctx.fillStyle = "#1a2332";
    ctx.fillRect(0, 0, gameWidth, gameHeight);

    // Draw road
    ctx.fillStyle = "#2d3748";
    ctx.fillRect(50, 0, gameWidth - 100, gameHeight);

    // Draw road lines
    ctx.strokeStyle = "#f7fafc";
    ctx.lineWidth = 3;
    ctx.setLineDash([30, 25]);
    for (let i = 0; i < 5; i++) {
      const x = 50 + ((i + 1) * (gameWidth - 100)) / 6;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, gameHeight);
      ctx.stroke();
    }

    // Draw road edges
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 4;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(50, 0);
    ctx.lineTo(50, gameHeight);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(gameWidth - 50, 0);
    ctx.lineTo(gameWidth - 50, gameHeight);
    ctx.stroke();

    // Draw car (more detailed)
    const car = carRef.current;
    // Car body
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(car.x, car.y, car.width, car.height);
    // Car roof
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(car.x + 5, car.y + 10, car.width - 10, car.height - 30);
    // Windshield
    ctx.fillStyle = "#93c5fd";
    ctx.fillRect(car.x + 8, car.y + 12, car.width - 16, 18);
    // Headlights
    ctx.fillStyle = "#fef3c7";
    ctx.fillRect(car.x + 3, car.y + car.height - 8, 8, 6);
    ctx.fillRect(car.x + car.width - 11, car.y + car.height - 8, 8, 6);

    // Draw obstacles (more detailed)
    obstaclesRef.current.forEach(obstacle => {
      // Obstacle body
      ctx.fillStyle = "#1f2937";
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      // Obstacle roof
      ctx.fillStyle = "#111827";
      ctx.fillRect(obstacle.x + 5, obstacle.y + 10, obstacle.width - 10, obstacle.height - 30);
      // Windows
      ctx.fillStyle = "#374151";
      ctx.fillRect(obstacle.x + 8, obstacle.y + 12, obstacle.width - 16, 18);
      // Taillights
      ctx.fillStyle = "#dc2626";
      ctx.fillRect(obstacle.x + 3, obstacle.y, 8, 5);
      ctx.fillRect(obstacle.x + obstacle.width - 11, obstacle.y, 8, 5);
    });

    // Draw coins (enhanced)
    coinsRef.current.forEach(coin => {
      if (!coin.collected) {
        const centerX = coin.x + coin.width / 2;
        const centerY = coin.y + coin.height / 2;
        const radius = coin.width / 2;

        // Outer glow
        const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.3, centerX, centerY, radius * 1.5);
        gradient.addColorStop(0, "#fbbf24");
        gradient.addColorStop(0.7, "#f59e0b");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Coin body
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner shine
        ctx.fillStyle = "#fde68a";
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // ETH symbol
        ctx.fillStyle = "#f59e0b";
        ctx.font = `${radius}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("₿", centerX, centerY);
      }
    });

    // Update score
    setGameState(prev => ({
      ...prev,
      score: prev.score + 1,
    }));

    if (!gameState.gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameState.isPlaying, gameState.gameOver, keys]);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop, gameState.isPlaying, gameState.gameOver]);

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      gameOver: false,
      score: 0,
      tokensEarned: 0,
    }));
    carRef.current = { x: 280, y: 400, width: 45, height: 70 };
    obstaclesRef.current = [];
    coinsRef.current = [];
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      gameOver: false,
    }));
    obstaclesRef.current = [];
    coinsRef.current = [];
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-base-100 rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative bg-gradient-to-b from-base-300 to-base-200 p-6">
          <canvas
            ref={canvasRef}
            width={gameWidth}
            height={gameHeight}
            className="w-full border-2 border-base-content/10 rounded-xl shadow-lg bg-slate-800"
            style={{ maxWidth: "100%", height: "auto", aspectRatio: `${gameWidth}/${gameHeight}` }}
          />

          {!gameState.isPlaying && !gameState.gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-base-100/90 rounded-lg">
              <div className="text-center">
                <PlayIcon className="h-16 w-16 mx-auto mb-4 text-primary" />
                <p className="text-lg font-bold mb-2">Ready to Race?</p>
                <p className="text-sm text-base-content/70 mb-4">
                  Use ← → arrow keys to avoid obstacles and collect coins!
                </p>
                <button className="btn btn-primary btn-lg" onClick={startGame}>
                  Start Game
                </button>
              </div>
            </div>
          )}

          {gameState.gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-base-100/95 rounded-lg">
              <div className="text-center">
                <TrophyIcon className="h-16 w-16 mx-auto mb-4 text-warning" />
                <p className="text-2xl font-bold mb-2">Game Over!</p>
                <div className="stats stats-vertical shadow mb-4">
                  <div className="stat">
                    <div className="stat-title">Final Score</div>
                    <div className="stat-value text-primary">{gameState.score}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Tokens Earned</div>
                    <div className="stat-value text-secondary">{gameState.tokensEarned.toFixed(3)} ETH</div>
                  </div>
                  {gameState.score > gameState.highScore && (
                    <div className="stat">
                      <div className="stat-title">🎉 New High Score!</div>
                      <div className="stat-value text-accent">{gameState.score}</div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 justify-center">
                  <button className="btn btn-primary" onClick={startGame}>
                    Play Again
                  </button>
                  <button className="btn btn-outline" onClick={resetGame}>
                    <ArrowPathIcon className="h-5 w-5" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Game Stats */}
        <div className="bg-base-200/50 backdrop-blur-sm rounded-xl p-4 mt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="stat bg-base-100/80 rounded-lg p-4 text-center">
              <div className="stat-title text-sm font-medium">Score</div>
              <div className="stat-value text-2xl text-primary font-bold">{gameState.score.toLocaleString()}</div>
            </div>
            <div className="stat bg-base-100/80 rounded-lg p-4 text-center">
              <div className="stat-title text-sm font-medium">High Score</div>
              <div className="stat-value text-2xl text-secondary font-bold">{gameState.highScore.toLocaleString()}</div>
            </div>
            <div className="stat bg-base-100/80 rounded-lg p-4 text-center">
              <div className="stat-title text-sm font-medium">Tokens Earned</div>
              <div className="stat-value text-2xl text-accent font-bold">{gameState.tokensEarned.toFixed(3)} ETH</div>
            </div>
          </div>

          {gameState.isPlaying && (
            <div className="text-center mt-4 p-3 bg-base-100/60 rounded-lg">
              <p className="text-base font-medium text-base-content/80">
                🎮 Use ← → arrows to steer • 🚗 Avoid obstacles • 💰 Collect crypto coins
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarRacingGame;

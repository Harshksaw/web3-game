"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { TrophyIcon, PlayIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

interface GameState {
  isPlaying: boolean;
  gameOver: boolean;
  victory: boolean;
  score: number;
  highScore: number;
  tokensEarned: number;
  level: number;
  timeElapsed: number;
}

interface Player {
  x: number;
  y: number;
  size: number;
  shiftUsed: boolean;
  shiftActive: boolean;
  shiftTimer: number;
}

interface GameGrid {
  walls: boolean[][];
  startX: number;
  startY: number;
  exitX: number;
  exitY: number;
  gridSize: number;
}

const TryHarderGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player>({ 
    x: 50, y: 50, size: 20, 
    shiftUsed: false, shiftActive: false, shiftTimer: 0 
  });
  const gridRef = useRef<GameGrid>({ 
    walls: [], startX: 1, startY: 1, exitX: 15, exitY: 15, gridSize: 25 
  });
  const startTimeRef = useRef<number>(Date.now());
  
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    gameOver: false,
    victory: false,
    score: 0,
    highScore: 0,
    tokensEarned: 0,
    level: 1,
    timeElapsed: 0,
  });

  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});
  const [isFullscreen, setIsFullscreen] = useState(false);

  const gameWidth = 600;
  const gameHeight = 500;
  const gridCols = 24;
  const gridRows = 20;
  const cellSize = 25;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHighScore = localStorage.getItem("tryHarderHighScore");
      if (savedHighScore) {
        setGameState(prev => ({ ...prev, highScore: parseInt(savedHighScore) }));
      }
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default behavior for game keys to stop page scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' ', 'Shift'].includes(e.key)) {
      e.preventDefault();
    }
    
    setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
    
    // Handle shift ability
    if ((e.key === "Shift" || e.key === " ") && !playerRef.current.shiftUsed && gameState.isPlaying) {
      playerRef.current.shiftActive = true;
      playerRef.current.shiftUsed = true;
      playerRef.current.shiftTimer = 120; // 2 seconds at 60fps
    }
    
    // Handle restart
    if ((e.key === " " || e.key === "Enter") && gameState.gameOver) {
      restartGame();
    }
  }, [gameState.isPlaying, gameState.gameOver]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: false }));
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const generateMaze = (): GameGrid => {
    const walls: boolean[][] = [];
    
    // Initialize all cells as no walls
    for (let x = 0; x < gridCols; x++) {
      walls[x] = [];
      for (let y = 0; y < gridRows; y++) {
        walls[x][y] = false;
      }
    }
    
    // Add border walls
    for (let x = 0; x < gridCols; x++) {
      walls[x][0] = true; // top border
      walls[x][gridRows - 1] = true; // bottom border
    }
    for (let y = 0; y < gridRows; y++) {
      walls[0][y] = true; // left border
      walls[gridCols - 1][y] = true; // right border
    }
    
    // Add random walls
    for (let i = 0; i < 60; i++) {
      const x = Math.floor(Math.random() * (gridCols - 2)) + 1;
      const y = Math.floor(Math.random() * (gridRows - 2)) + 1;
      walls[x][y] = true;
    }
    
    const startX = 1;
    const startY = 1;
    const exitX = gridCols - 2;
    const exitY = gridRows - 2;
    
    // Ensure start and exit are clear
    walls[startX][startY] = false;
    walls[exitX][exitY] = false;
    
    return {
      walls,
      startX,
      startY,
      exitX,
      exitY,
      gridSize: cellSize
    };
  };

  const checkWallCollision = (x: number, y: number, size: number): boolean => {
    if (playerRef.current.shiftActive) return false;
    
    const grid = gridRef.current;
    const leftCol = Math.floor(x / cellSize);
    const rightCol = Math.floor((x + size) / cellSize);
    const topRow = Math.floor(y / cellSize);
    const bottomRow = Math.floor((y + size) / cellSize);
    
    for (let col = leftCol; col <= rightCol; col++) {
      for (let row = topRow; row <= bottomRow; row++) {
        if (col >= 0 && col < gridCols && row >= 0 && row < gridRows) {
          if (grid.walls[col] && grid.walls[col][row]) {
            return true;
          }
        }
      }
    }
    
    // Check boundaries
    return x < 0 || y < 0 || x + size > gameWidth || y + size > gameHeight;
  };

  const checkExit = (x: number, y: number, size: number): boolean => {
    const grid = gridRef.current;
    const exitPixelX = grid.exitX * cellSize;
    const exitPixelY = grid.exitY * cellSize;
    
    return (
      x + size > exitPixelX &&
      x < exitPixelX + cellSize &&
      y + size > exitPixelY &&
      y < exitPixelY + cellSize
    );
  };

  const gameLoop = useCallback(() => {
    if (!gameState.isPlaying || gameState.gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const player = playerRef.current;

    // Update shift timer
    if (player.shiftActive) {
      player.shiftTimer--;
      if (player.shiftTimer <= 0) {
        player.shiftActive = false;
      }
    }

    // Simple direct movement
    const moveSpeed = player.shiftActive ? 6 : 3;
    let newX = player.x;
    let newY = player.y;

    if (keys["w"] || keys["arrowup"]) newY -= moveSpeed;
    if (keys["s"] || keys["arrowdown"]) newY += moveSpeed;
    if (keys["a"] || keys["arrowleft"]) newX -= moveSpeed;
    if (keys["d"] || keys["arrowright"]) newX += moveSpeed;

    // Check collision and update position
    if (!checkWallCollision(newX, player.y, player.size)) {
      player.x = newX;
    }

    if (!checkWallCollision(player.x, newY, player.size)) {
      player.y = newY;
    }

    // Check for collision when not in shift mode
    if (!player.shiftActive && checkWallCollision(player.x, player.y, player.size)) {
      // Game over
      setGameState(prev => {
        const timeElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const newScore = Math.max(0, 1000 - timeElapsed * 10 + prev.level * 100);
        const newHighScore = Math.max(newScore, prev.highScore);
        if (typeof window !== "undefined") {
          localStorage.setItem("tryHarderHighScore", newHighScore.toString());
        }
        return {
          ...prev,
          gameOver: true,
          victory: false,
          score: newScore,
          highScore: newHighScore,
          timeElapsed,
        };
      });
      return;
    }

    // Check for exit
    if (checkExit(player.x, player.y, player.size)) {
      // Victory!
      setGameState(prev => {
        const timeElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const timeBonus = Math.max(0, 500 - timeElapsed * 5);
        const levelBonus = prev.level * 200;
        const shiftBonus = player.shiftUsed ? 0 : 300;
        const newScore = timeBonus + levelBonus + shiftBonus;
        const newHighScore = Math.max(newScore, prev.highScore);
        if (typeof window !== "undefined") {
          localStorage.setItem("tryHarderHighScore", newHighScore.toString());
        }
        return {
          ...prev,
          gameOver: true,
          victory: true,
          score: newScore,
          highScore: newHighScore,
          tokensEarned: prev.tokensEarned + newScore * 0.0001,
          timeElapsed,
        };
      });
      return;
    }

    // Clear canvas with flashing effect
    const flashIntensity = player.shiftActive ? Math.sin(Date.now() * 0.02) * 0.3 + 0.7 : 1;
    ctx.fillStyle = `rgba(42, 54, 85, ${flashIntensity})`;
    ctx.fillRect(0, 0, gameWidth, gameHeight);

    // Draw grid
    const grid = gridRef.current;
    
    // Draw walls
    ctx.fillStyle = player.shiftActive ? "#ef4444" : "#1f2937";
    for (let x = 0; x < gridCols; x++) {
      for (let y = 0; y < gridRows; y++) {
        if (grid.walls[x] && grid.walls[x][y]) {
          const alpha = player.shiftActive ? Math.sin(Date.now() * 0.05) * 0.3 + 0.7 : 1;
          ctx.fillStyle = player.shiftActive ? `rgba(239, 68, 68, ${alpha})` : "#1f2937";
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }

    // Draw exit
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(grid.exitX * cellSize, grid.exitY * cellSize, cellSize, cellSize);
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(grid.exitX * cellSize + 5, grid.exitY * cellSize + 5, cellSize - 10, cellSize - 10);

    // Draw player
    if (player.shiftActive) {
      // Glowing effect when shift is active
      const gradient = ctx.createRadialGradient(
        player.x + player.size/2, player.y + player.size/2, 0,
        player.x + player.size/2, player.y + player.size/2, player.size
      );
      gradient.addColorStop(0, "#fbbf24");
      gradient.addColorStop(1, "#f59e0b");
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = "#3b82f6";
    }
    ctx.fillRect(player.x, player.y, player.size, player.size);

    // Update time
    setGameState(prev => ({
      ...prev,
      timeElapsed: Math.floor((Date.now() - startTimeRef.current) / 1000),
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
    const grid = generateMaze();
    gridRef.current = grid;
    
    playerRef.current = {
      x: grid.startX * cellSize,
      y: grid.startY * cellSize,
      size: 20,
      shiftUsed: false,
      shiftActive: false,
      shiftTimer: 0,
    };
    
    startTimeRef.current = Date.now();
    
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      gameOver: false,
      victory: false,
      score: 0,
      timeElapsed: 0,
    }));
  };

  const restartGame = () => {
    setGameState(prev => ({
      ...prev,
      level: prev.victory ? prev.level + 1 : prev.level,
    }));
    startGame();
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      gameOver: false,
      victory: false,
      level: 1,
    }));
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div ref={containerRef} className={`w-full max-w-4xl mx-auto ${isFullscreen ? 'fullscreen-game' : ''}`}>
      <div className="bg-base-100 rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative bg-gradient-to-b from-base-300 to-base-200 p-6">
          {/* Fullscreen Toggle */}
          <div className="absolute top-2 right-2 z-10">
            <button 
              onClick={toggleFullscreen}
              className="btn btn-sm btn-circle btn-primary opacity-70 hover:opacity-100"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? '⤢' : '⤢'}
            </button>
          </div>
          
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
                <p className="text-lg font-bold mb-2">Ready to Try Harder?</p>
                <p className="text-sm text-base-content/70 mb-4">
                  Navigate the maze to the green exit. Use WASD to move, Shift for superpower!
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
                <div className="text-6xl mb-4">
                  {gameState.victory ? '🏆' : '💀'}
                </div>
                <p className="text-3xl font-bold mb-4">
                  {gameState.victory ? 'YOU WIN!' : 'GAME OVER'}
                </p>
                <p className="text-lg mb-6">
                  Score: {gameState.score} • Time: {gameState.timeElapsed}s
                  {gameState.victory && ` • Level ${gameState.level}`}
                </p>
                <div className="flex gap-4 justify-center">
                  <button className="btn btn-primary btn-lg" onClick={restartGame}>
                    {gameState.victory ? 'NEXT LEVEL' : 'TRY AGAIN'}
                  </button>
                  <button className="btn btn-outline btn-lg" onClick={resetGame}>
                    RESTART
                  </button>
                </div>
                <p className="text-sm mt-4 text-base-content/70">
                  Press SPACE or ENTER to restart
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Simple Stats */}
        <div className="bg-base-200/50 rounded-xl p-4 mt-4 text-center">
          <div className="flex justify-center gap-8 mb-4">
            <div>
              <div className="text-sm text-base-content/70">Score</div>
              <div className="text-xl font-bold text-primary">{gameState.score}</div>
            </div>
            <div>
              <div className="text-sm text-base-content/70">High Score</div>
              <div className="text-xl font-bold text-secondary">{gameState.highScore}</div>
            </div>
            <div>
              <div className="text-sm text-base-content/70">Level</div>
              <div className="text-xl font-bold text-accent">{gameState.level}</div>
            </div>
            <div>
              <div className="text-sm text-base-content/70">Time</div>
              <div className="text-xl font-bold text-warning">{gameState.timeElapsed}s</div>
            </div>
          </div>
          
          {gameState.isPlaying && (
            <div className="text-center">
              <p className="text-base font-medium text-base-content/80 mb-2">
                WASD/Arrows to move • Shift for superpower • Reach the green exit
              </p>
              {!playerRef.current.shiftUsed && (
                <div className="badge badge-warning">
                  Superpower Available! 
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TryHarderGame;
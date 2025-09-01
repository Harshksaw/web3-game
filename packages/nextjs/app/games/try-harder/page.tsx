"use client";

import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import {
  ArrowLeftIcon,
  BoltIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  FireIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import TryHarderGame from "~~/components/TryHarderGame";
import { Address } from "~~/components/scaffold-eth";

const TryHarderPage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [stakeAmount, setStakeAmount] = useState("0.005");
  const [isStaked, setIsStaked] = useState(false);

  const handleStake = () => {
    // TODO: Implement actual staking logic
    setIsStaked(true);
  };

  const handleUnstake = () => {
    // TODO: Implement actual unstaking logic
    setIsStaked(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
      {/* Header */}
      <div className="navbar bg-base-100/80 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost btn-sm">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Games
          </Link>
        </div>
        <div className="flex-none">
          {connectedAddress && (
            <div className="flex items-center gap-3 bg-base-200/50 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <Address address={connectedAddress} />
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Game Section - Takes up 2/3 width on xl screens */}
          <div className="xl:col-span-2">
            <div className="card bg-base-100 shadow-2xl">
              <div className="card-body p-0">
                {/* Game Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                        ⚡ Try Harder
                        <div className="badge badge-success">LIVE</div>
                      </h1>
                      <p className="text-purple-100">
                        Navigate deadly mazes with precision and strategy. One mistake costs everything!
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="stat bg-white/10 rounded-lg p-3">
                        <div className="stat-title text-purple-200 text-xs">Your Balance</div>
                        <div className="stat-value text-white text-lg">
                          {isStaked ? `${stakeAmount} ETH` : "0.00 ETH"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Game Container */}
                <div className="p-6">
                  {!connectedAddress ? (
                    <div className="text-center py-20">
                      <BoltIcon className="h-20 w-20 mx-auto mb-4 text-warning" />
                      <h3 className="text-2xl font-bold mb-2">Connect Your Wallet</h3>
                      <p className="text-base-content/70 mb-6">
                        You need to connect your wallet to stake and play games
                      </p>
                      <button className="btn btn-primary btn-lg">Connect Wallet</button>
                    </div>
                  ) : !isStaked ? (
                    <div className="text-center py-20">
                      <CurrencyDollarIcon className="h-20 w-20 mx-auto mb-4 text-primary" />
                      <h3 className="text-2xl font-bold mb-2">Stake to Play</h3>
                      <p className="text-base-content/70 mb-6">
                        Stake ETH to unlock the game and start earning rewards based on your performance
                      </p>
                      <div className="max-w-md mx-auto">
                        <div className="form-control mb-4">
                          <label className="label">
                            <span className="label-text">Stake Amount (ETH)</span>
                          </label>
                          <input
                            type="number"
                            value={stakeAmount}
                            onChange={e => setStakeAmount(e.target.value)}
                            className="input input-bordered input-primary"
                            min="0.005"
                            step="0.001"
                          />
                        </div>
                        <button className="btn btn-primary btn-lg w-full" onClick={handleStake}>
                          Stake {stakeAmount} ETH & Play
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Game Controls */}
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-4">
                          <div className="stat bg-base-200 rounded-lg p-3">
                            <div className="stat-title text-xs">Staked</div>
                            <div className="stat-value text-primary text-sm">{stakeAmount} ETH</div>
                          </div>
                          <div className="stat bg-base-200 rounded-lg p-3">
                            <div className="stat-title text-xs">Potential Reward</div>
                            <div className="stat-value text-secondary text-sm">
                              {(parseFloat(stakeAmount) * 3).toFixed(3)} ETH
                            </div>
                          </div>
                        </div>
                        <button className="btn btn-outline btn-error btn-sm" onClick={handleUnstake}>
                          Unstake & Exit
                        </button>
                      </div>

                      {/* Full Game Component */}
                      <div className="bg-base-200 rounded-xl p-4">
                        <TryHarderGame />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Game Stats */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg mb-4">
                  <ChartBarIcon className="h-5 w-5" />
                  Game Stats
                </h3>
                <div className="space-y-3">
                  <div className="stat bg-base-200/50 rounded-lg p-3">
                    <div className="stat-title text-xs">Total Players</div>
                    <div className="stat-value text-primary text-lg">892</div>
                    <div className="stat-desc text-xs">↗ 22% this week</div>
                  </div>
                  <div className="stat bg-base-200/50 rounded-lg p-3">
                    <div className="stat-title text-xs">Total Staked</div>
                    <div className="stat-value text-secondary text-lg">12.8 ETH</div>
                    <div className="stat-desc text-xs">↗ 18% this week</div>
                  </div>
                  <div className="stat bg-base-200/50 rounded-lg p-3">
                    <div className="stat-title text-xs">Rewards Paid</div>
                    <div className="stat-value text-accent text-lg">8.4 ETH</div>
                    <div className="stat-desc text-xs">All time</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg mb-4">
                  <TrophyIcon className="h-5 w-5" />
                  Speed Champions
                </h3>
                <div className="space-y-2">
                  {[
                    { rank: 1, address: "0x8A9d...7B2f", time: "12.3s", level: 15, reward: "0.8 ETH" },
                    { rank: 2, address: "0x2F44...6C91", time: "15.7s", level: 12, reward: "0.5 ETH" },
                    { rank: 3, address: "0xB78E...D143", time: "18.2s", level: 10, reward: "0.3 ETH" },
                    { rank: 4, address: "0x3C65...A829", time: "21.8s", level: 8, reward: "0.2 ETH" },
                    { rank: 5, address: "0x9D12...F567", time: "25.1s", level: 7, reward: "0.1 ETH" },
                  ].map(player => (
                    <div key={player.rank} className="flex items-center justify-between p-2 bg-base-200/50 rounded">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            player.rank === 1
                              ? "bg-yellow-500 text-white"
                              : player.rank === 2
                                ? "bg-gray-400 text-white"
                                : player.rank === 3
                                  ? "bg-orange-600 text-white"
                                  : "bg-base-300"
                          }`}
                        >
                          {player.rank}
                        </div>
                        <div>
                          <div className="font-mono text-sm">{player.address}</div>
                          <div className="text-xs text-base-content/70">
                            L{player.level} • {player.time}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-success">{player.reward}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* How to Play */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg mb-4">
                  <FireIcon className="h-5 w-5" />
                  How to Play
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <div className="badge badge-primary badge-sm">1</div>
                    <div>Stake ETH to unlock intense maze gameplay</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="badge badge-primary badge-sm">2</div>
                    <div>Navigate the blue square to the green exit</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="badge badge-primary badge-sm">3</div>
                    <div>Use WASD or arrows to move precisely</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="badge badge-primary badge-sm">4</div>
                    <div>Hold Shift for wall-phase superpower (once only!)</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="badge badge-primary badge-sm">5</div>
                    <div>Faster completion = higher rewards</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="badge badge-warning badge-sm">⚠️</div>
                    <div>Touch any wall = instant game over!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryHarderPage;

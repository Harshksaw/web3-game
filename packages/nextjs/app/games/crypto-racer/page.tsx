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
  TrophyIcon,
} from "@heroicons/react/24/outline";
import CarRacingGame from "~~/components/CarRacingGame";
import { Address } from "~~/components/scaffold-eth";

const CryptoRacerPage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [stakeAmount, setStakeAmount] = useState("0.01");
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
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                        🏎️ Crypto Racer
                        <div className="badge badge-success">LIVE</div>
                      </h1>
                      <p className="text-blue-100">High-speed racing meets DeFi rewards. Stake to play and earn!</p>
                    </div>
                    <div className="text-right">
                      <div className="stat bg-white/10 rounded-lg p-3">
                        <div className="stat-title text-blue-200 text-xs">Your Balance</div>
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
                        Stake ETH to unlock the game and start earning rewards
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
                            min="0.01"
                            step="0.01"
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
                              {(parseFloat(stakeAmount) * 2).toFixed(2)} ETH
                            </div>
                          </div>
                        </div>
                        <button className="btn btn-outline btn-error btn-sm" onClick={handleUnstake}>
                          Unstake & Exit
                        </button>
                      </div>

                      {/* Full Game Component */}
                      <div className="bg-base-200 rounded-xl p-4">
                        <CarRacingGame />
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
                    <div className="stat-value text-primary text-lg">1,234</div>
                    <div className="stat-desc text-xs">↗ 15% this week</div>
                  </div>
                  <div className="stat bg-base-200/50 rounded-lg p-3">
                    <div className="stat-title text-xs">Total Staked</div>
                    <div className="stat-value text-secondary text-lg">45.2 ETH</div>
                    <div className="stat-desc text-xs">↗ 8% this week</div>
                  </div>
                  <div className="stat bg-base-200/50 rounded-lg p-3">
                    <div className="stat-title text-xs">Rewards Paid</div>
                    <div className="stat-value text-accent text-lg">28.7 ETH</div>
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
                  Top Players
                </h3>
                <div className="space-y-2">
                  {[
                    { rank: 1, address: "0x742d...35Af", score: 15420, reward: "2.1 ETH" },
                    { rank: 2, address: "0x8D11...22eF", score: 12890, reward: "1.5 ETH" },
                    { rank: 3, address: "0x1f9f...88Cd", score: 11200, reward: "1.0 ETH" },
                    { rank: 4, address: "0x456B...19Fe", score: 9870, reward: "0.5 ETH" },
                    { rank: 5, address: "0x789C...44Aa", score: 8650, reward: "0.3 ETH" },
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
                          <div className="text-xs text-base-content/70">{player.score.toLocaleString()}</div>
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
                  <PlayIcon className="h-5 w-5" />
                  How to Play
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <div className="badge badge-primary badge-sm">1</div>
                    <div>Stake ETH to unlock the game</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="badge badge-primary badge-sm">2</div>
                    <div>Use ← → arrows to steer your car</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="badge badge-primary badge-sm">3</div>
                    <div>Avoid obstacles and collect coins</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="badge badge-primary badge-sm">4</div>
                    <div>Higher scores earn more rewards</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="badge badge-primary badge-sm">5</div>
                    <div>Claim your earnings anytime</div>
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

export default CryptoRacerPage;

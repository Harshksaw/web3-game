"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { 
  CubeIcon, 
  CurrencyDollarIcon, 
  TrophyIcon,
  PlayIcon,
  ChartBarIcon,
  BoltIcon 
} from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
        {/* Hero Section */}
        <div className="hero min-h-[60vh] relative overflow-hidden">
          <div className="hero-content text-center">
            <div className="max-w-4xl">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <CubeIcon className="h-20 w-20 text-primary animate-pulse" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                </div>
              </div>
              
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
                CryptoStake Gaming
              </h1>
              
              <p className="text-xl text-base-content/80 mb-8 max-w-2xl mx-auto">
                Stake your crypto, play exciting games, and earn rewards in the ultimate Web3 gaming experience.
              </p>

              {connectedAddress ? (
                <div className="flex flex-col items-center gap-4 mb-8">
                  <div className="flex items-center gap-3 bg-base-100/50 backdrop-blur-sm px-6 py-3 rounded-full border border-base-300">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Connected:</span>
                    <Address address={connectedAddress} />
                  </div>
                </div>
              ) : (
                <div className="text-center mb-8">
                  <div className="alert alert-warning max-w-md mx-auto">
                    <BoltIcon className="h-6 w-6" />
                    <span>Connect your wallet to start playing!</span>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  className="btn btn-primary btn-lg px-8 shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={!connectedAddress}
                >
                  <PlayIcon className="h-6 w-6" />
                  Start Playing
                </button>
                <button 
                  className="btn btn-secondary btn-lg px-8 shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={!connectedAddress}
                >
                  <CurrencyDollarIcon className="h-6 w-6" />
                  Stake Tokens
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-base-content mb-4">Game Features</h2>
            <p className="text-lg text-base-content/70">Experience the future of crypto gaming</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Staking Card */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="card-body items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <CurrencyDollarIcon className="h-12 w-12 text-primary" />
                </div>
                <h3 className="card-title text-2xl mb-3">Crypto Staking</h3>
                <p className="text-base-content/70 mb-4">
                  Stake your tokens to earn passive rewards while you play. Higher stakes unlock premium features.
                </p>
                <div className="card-actions">
                  <button className="btn btn-outline btn-primary" disabled={!connectedAddress}>
                    View Staking
                  </button>
                </div>
              </div>
            </div>

            {/* Gaming Card */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="card-body items-center text-center">
                <div className="bg-secondary/10 p-4 rounded-full mb-4">
                  <PlayIcon className="h-12 w-12 text-secondary" />
                </div>
                <h3 className="card-title text-2xl mb-3">Play & Earn</h3>
                <p className="text-base-content/70 mb-4">
                  Compete in skill-based games and tournaments. Win crypto rewards and climb the leaderboards.
                </p>
                <div className="card-actions">
                  <button className="btn btn-outline btn-secondary" disabled={!connectedAddress}>
                    Play Now
                  </button>
                </div>
              </div>
            </div>

            {/* Rewards Card */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="card-body items-center text-center">
                <div className="bg-accent/10 p-4 rounded-full mb-4">
                  <TrophyIcon className="h-12 w-12 text-accent" />
                </div>
                <h3 className="card-title text-2xl mb-3">Earn Rewards</h3>
                <p className="text-base-content/70 mb-4">
                  Collect NFT achievements, unlock rare items, and earn token rewards for your gaming skills.
                </p>
                <div className="card-actions">
                  <button className="btn btn-outline btn-accent" disabled={!connectedAddress}>
                    View Rewards
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-base-200/50 backdrop-blur-sm py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="stat bg-base-100/80 rounded-2xl shadow-lg">
                <div className="stat-figure text-primary">
                  <ChartBarIcon className="h-8 w-8" />
                </div>
                <div className="stat-title">Total Staked</div>
                <div className="stat-value text-primary">1,234 ETH</div>
                <div className="stat-desc">↗︎ 400 (22%) this month</div>
              </div>
              
              <div className="stat bg-base-100/80 rounded-2xl shadow-lg">
                <div className="stat-figure text-secondary">
                  <TrophyIcon className="h-8 w-8" />
                </div>
                <div className="stat-title">Active Players</div>
                <div className="stat-value text-secondary">5,678</div>
                <div className="stat-desc">↗︎ 90 (14%) this week</div>
              </div>
              
              <div className="stat bg-base-100/80 rounded-2xl shadow-lg">
                <div className="stat-figure text-accent">
                  <CurrencyDollarIcon className="h-8 w-8" />
                </div>
                <div className="stat-title">Rewards Paid</div>
                <div className="stat-value text-accent">892 ETH</div>
                <div className="stat-desc">All time rewards distributed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Games Collection */}
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-base-content mb-4">Play & Earn Games</h2>
            <p className="text-lg text-base-content/70">Choose your game, stake your tokens, and start earning!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Crypto Racer Game Card */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <figure className="relative h-48 bg-gradient-to-br from-blue-600 to-purple-700 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl">🏎️</div>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="badge badge-success">LIVE</div>
                </div>
              </figure>
              <div className="card-body">
                <h3 className="card-title text-xl mb-2">
                  Crypto Racer
                  <div className="badge badge-secondary">HOT</div>
                </h3>
                <p className="text-sm text-base-content/70 mb-4">
                  Race through traffic, collect coins, and earn crypto rewards. High-speed action meets DeFi rewards!
                </p>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="stat bg-base-200/50 rounded-lg p-2">
                    <div className="stat-title text-xs">Min Stake</div>
                    <div className="stat-value text-sm text-primary">0.01 ETH</div>
                  </div>
                  <div className="stat bg-base-200/50 rounded-lg p-2">
                    <div className="stat-title text-xs">Max Reward</div>
                    <div className="stat-value text-sm text-secondary">0.5 ETH</div>
                  </div>
                  <div className="stat bg-base-200/50 rounded-lg p-2">
                    <div className="stat-title text-xs">Players</div>
                    <div className="stat-value text-sm text-accent">1,234</div>
                  </div>
                  <div className="stat bg-base-200/50 rounded-lg p-2">
                    <div className="stat-title text-xs">Rewards Paid</div>
                    <div className="stat-value text-sm text-warning">45.2 ETH</div>
                  </div>
                </div>

                <div className="card-actions justify-between">
                  <Link href="/games/crypto-racer" className="btn btn-primary flex-1">
                    <PlayIcon className="h-4 w-4" />
                    Play Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Try Harder Game Card */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <figure className="relative h-48 bg-gradient-to-br from-purple-600 to-pink-700 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl">⚡</div>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="badge badge-success">LIVE</div>
                </div>
              </figure>
              <div className="card-body">
                <h3 className="card-title text-xl mb-2">
                  Try Harder
                  <div className="badge badge-error">EXTREME</div>
                </h3>
                <p className="text-sm text-base-content/70 mb-4">
                  Navigate deadly mazes with precision. One wrong move ends it all. Only the skilled survive!
                </p>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="stat bg-base-200/50 rounded-lg p-2">
                    <div className="stat-title text-xs">Min Stake</div>
                    <div className="stat-value text-sm text-primary">0.005 ETH</div>
                  </div>
                  <div className="stat bg-base-200/50 rounded-lg p-2">
                    <div className="stat-title text-xs">Max Reward</div>
                    <div className="stat-value text-sm text-secondary">0.8 ETH</div>
                  </div>
                  <div className="stat bg-base-200/50 rounded-lg p-2">
                    <div className="stat-title text-xs">Players</div>
                    <div className="stat-value text-sm text-accent">892</div>
                  </div>
                  <div className="stat bg-base-200/50 rounded-lg p-2">
                    <div className="stat-title text-xs">Rewards Paid</div>
                    <div className="stat-value text-sm text-warning">8.4 ETH</div>
                  </div>
                </div>

                <div className="card-actions justify-between">
                  <Link href="/games/try-harder" className="btn btn-primary flex-1">
                    <PlayIcon className="h-4 w-4" />
                    Play Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Coming Soon Game Cards */}
            <div className="card bg-base-100 shadow-xl opacity-60">
              <figure className="relative h-48 bg-gradient-to-br from-green-600 to-teal-700 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl">🎯</div>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="badge badge-warning">SOON</div>
                </div>
              </figure>
              <div className="card-body">
                <h3 className="card-title text-xl mb-2">
                  Crypto Shooter
                </h3>
                <p className="text-sm text-base-content/70 mb-4">
                  Test your aim and reflexes in this fast-paced shooter. Coming soon with NFT weapon drops!
                </p>
                <div className="card-actions">
                  <button className="btn btn-disabled flex-1" disabled>
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl opacity-60">
              <figure className="relative h-48 bg-gradient-to-br from-red-600 to-pink-700 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl">♠️</div>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="badge badge-warning">SOON</div>
                </div>
              </figure>
              <div className="card-body">
                <h3 className="card-title text-xl mb-2">
                  Crypto Poker
                </h3>
                <p className="text-sm text-base-content/70 mb-4">
                  High-stakes poker tournaments with crypto buy-ins and massive prize pools.
                </p>
                <div className="card-actions">
                  <button className="btn btn-disabled flex-1" disabled>
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="container mx-auto px-6 py-16">
          <div className="bg-base-100 rounded-3xl p-8 shadow-xl">
            <h3 className="text-3xl font-bold text-center mb-8">Quick Actions</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/debug" 
                className="btn btn-outline btn-primary gap-2 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <CubeIcon className="h-5 w-5" />
                Smart Contracts
              </Link>
              <Link 
                href="/blockexplorer" 
                className="btn btn-outline btn-secondary gap-2 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <ChartBarIcon className="h-5 w-5" />
                Block Explorer
              </Link>
              <button 
                className="btn btn-outline btn-accent gap-2 shadow-md hover:shadow-lg transition-all duration-300"
                disabled={!connectedAddress}
              >
                <TrophyIcon className="h-5 w-5" />
                Leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

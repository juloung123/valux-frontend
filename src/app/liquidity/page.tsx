'use client';

import { useState } from 'react';
import { Plus, Minus, TrendingUp, DollarSign, Percent } from 'lucide-react';

export default function LiquidityPage() {
  const [tab, setTab] = useState('add');
  const [token1Amount, setToken1Amount] = useState('');
  const [token2Amount, setToken2Amount] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Liquidity Pools
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Provide liquidity to earn trading fees and rewards
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add/Remove Liquidity Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 glass-effect">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
                    <button
                      onClick={() => setTab('add')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        tab === 'add'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Add Liquidity
                    </button>
                    <button
                      onClick={() => setTab('remove')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        tab === 'remove'
                          ? 'bg-red-500 text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Minus className="w-4 h-4 inline mr-2" />
                      Remove Liquidity
                    </button>
                  </div>
                </div>

                {tab === 'add' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Pair
                      </label>
                      <div className="flex space-x-2">
                        <button className="flex items-center space-x-2 bg-gray-100 dark:bg-slate-700 px-4 py-2 rounded-lg font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">E</span>
                          </div>
                          <span>ETH</span>
                        </button>
                        <span className="text-gray-500 dark:text-gray-400 self-center">+</span>
                        <button className="flex items-center space-x-2 bg-gray-100 dark:bg-slate-700 px-4 py-2 rounded-lg font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">U</span>
                          </div>
                          <span>USDC</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            ETH Amount
                          </label>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Balance: 2.5 ETH
                          </span>
                        </div>
                        <input
                          type="number"
                          value={token1Amount}
                          onChange={(e) => setToken1Amount(e.target.value)}
                          placeholder="0.0"
                          className="w-full bg-transparent text-2xl font-semibold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                        />
                      </div>

                      <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            USDC Amount
                          </label>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Balance: 1,250.0 USDC
                          </span>
                        </div>
                        <input
                          type="number"
                          value={token2Amount}
                          onChange={(e) => setToken2Amount(e.target.value)}
                          placeholder="0.0"
                          className="w-full bg-transparent text-2xl font-semibold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-slate-700 rounded-xl p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Pool Share</span>
                          <span className="text-gray-900 dark:text-white font-medium">0.25%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">LP Tokens</span>
                          <span className="text-gray-900 dark:text-white font-medium">1.581</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Fee (0.3%)</span>
                          <span className="text-gray-900 dark:text-white font-medium">$7.5</span>
                        </div>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover-lift">
                      Add Liquidity
                    </button>
                  </div>
                )}

                {tab === 'remove' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Select the amount of liquidity to remove
                      </p>
                      <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6">
                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          25%
                        </div>
                        <div className="flex space-x-2 justify-center mb-4">
                          <button className="px-3 py-1 bg-gray-200 dark:bg-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors">
                            25%
                          </button>
                          <button className="px-3 py-1 bg-gray-200 dark:bg-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors">
                            50%
                          </button>
                          <button className="px-3 py-1 bg-gray-200 dark:bg-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors">
                            75%
                          </button>
                          <button className="px-3 py-1 bg-gray-200 dark:bg-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors">
                            MAX
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-slate-700 rounded-xl p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">You will receive</span>
                          <span className="text-gray-900 dark:text-white font-medium">0.625 ETH</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300"></span>
                          <span className="text-gray-900 dark:text-white font-medium">312.5 USDC</span>
                        </div>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover-lift">
                      Remove Liquidity
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Pool Stats */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 glass-effect">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Pool Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">APY</span>
                    </div>
                    <span className="text-green-500 font-semibold">24.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">TVL</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-semibold">$12.5M</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Percent className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Fee</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-semibold">0.3%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 glass-effect">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Your Positions
                </h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">E</span>
                        </div>
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">U</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">ETH/USDC</span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">$2,500</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Pool share: 0.25% • Earned: $12.5
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
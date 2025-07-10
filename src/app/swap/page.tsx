'use client';

import { useState } from 'react';
import { ArrowDown, Settings, RefreshCw, Info } from 'lucide-react';

export default function SwapPage() {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');

  const handleSwap = () => {
    // Swap logic would go here
    console.log('Swapping', fromAmount, fromToken, 'to', toToken);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Swap Tokens
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Trade tokens instantly with the best rates
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 glass-effect">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Swap
              </h2>
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* From Token */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    From
                  </label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Balance: 2.5 ETH
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    placeholder="0.0"
                    className="flex-1 bg-transparent text-2xl font-semibold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                  />
                  <button className="flex items-center space-x-2 bg-white dark:bg-slate-600 px-3 py-2 rounded-lg font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-500 transition-colors">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">E</span>
                    </div>
                    <span>{fromToken}</span>
                  </button>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                  <ArrowDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              {/* To Token */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    To
                  </label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Balance: 1,250.0 USDC
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    value={toAmount}
                    onChange={(e) => setToAmount(e.target.value)}
                    placeholder="0.0"
                    className="flex-1 bg-transparent text-2xl font-semibold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                  />
                  <button className="flex items-center space-x-2 bg-white dark:bg-slate-600 px-3 py-2 rounded-lg font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-500 transition-colors">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">U</span>
                    </div>
                    <span>{toToken}</span>
                  </button>
                </div>
              </div>

              {/* Swap Details */}
              <div className="bg-blue-50 dark:bg-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Rate</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    1 ETH = 2,500 USDC
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600 dark:text-gray-300">Price Impact</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    &lt; 0.01%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600 dark:text-gray-300">Fee</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    0.3%
                  </span>
                </div>
              </div>

              {/* Swap Button */}
              <button
                onClick={handleSwap}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover-lift"
              >
                Swap Tokens
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl p-4 glass-effect">
            <div className="flex items-center space-x-2 mb-3">
              <Info className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Swap Information
              </h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p>• Minimum received: 2,490 USDC</p>
              <p>• Route: ETH → USDC (Direct)</p>
              <p>• Gas fee: ~$15 (estimated)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
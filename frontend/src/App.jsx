import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useWriteContract, useReadContract } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { parseEther, formatEther } from 'viem';

const CONTRACT_ADDRESS = '0xF7Aa71aF0f4FBDEd0F81565F55E85518907F69A6';

const CONTRACT_ABI = [
  {
    inputs: [{ name: 'amount', type: 'uint256' }],
    name: 'depositFXRP',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getFLRPrice',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'assets', type: 'uint256' }],
    name: 'depositFirelight',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'assets', type: 'uint256' }],
    name: 'depositUpshift',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getFXRPBalance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getFirelightShares',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getUpshiftShares',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

function App() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: injected() });
  const { disconnect } = useDisconnect();
  const { writeContract } = useWriteContract();

  const [depositAmount, setDepositAmount] = useState('');
  const [firelightAmount, setFirelightAmount] = useState('');
  const [upshiftAmount, setUpshiftAmount] = useState('');

  const { data: price } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getFLRPrice',
  });

  const { data: fxrpBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getFXRPBalance',
    args: address ? [address] : undefined,
  });

  const { data: firelightShares } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getFirelightShares',
    args: address ? [address] : undefined,
  });

  const { data: upshiftShares } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getUpshiftShares',
    args: address ? [address] : undefined,
  });

  const handleDeposit = () => {
    if (!depositAmount) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'depositFXRP',
      args: [parseEther(depositAmount)],
    });
  };

  const handleFirelightDeposit = () => {
    if (!firelightAmount) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'depositFirelight',
      args: [parseEther(firelightAmount)],
    });
  };

  const handleUpshiftDeposit = () => {
    if (!upshiftAmount) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'depositUpshift',
      args: [parseEther(upshiftAmount)],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              🚀 FXRP DeFi Hub
            </h1>
            <p className="text-gray-400 text-sm mt-1">Flare Summer Signal Hackathon 2026</p>
          </div>
          {!isConnected ? (
            <button
              onClick={() => connect()}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-6 py-2.5 rounded-lg transition font-medium shadow-lg shadow-orange-500/25"
            >
              🔗 Connect Wallet
            </button>
          ) : (
            <div className="flex items-center gap-4 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
              <span className="text-sm text-gray-400">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <button
                onClick={() => disconnect()}
                className="bg-red-600/20 hover:bg-red-600/40 px-4 py-1.5 rounded-lg transition text-sm text-red-400"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        {isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700">
              <p className="text-sm text-gray-400">FXRP Balance</p>
              <p className="text-xl font-bold">{fxrpBalance ? Number(formatEther(fxrpBalance)).toFixed(4) : '0'} FXRP</p>
            </div>
            <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700">
              <p className="text-sm text-gray-400">Firelight Shares</p>
              <p className="text-xl font-bold">{firelightShares ? Number(formatEther(firelightShares)).toFixed(4) : '0'}</p>
            </div>
            <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700">
              <p className="text-sm text-gray-400">Upshift Shares</p>
              <p className="text-xl font-bold">{upshiftShares ? Number(formatEther(upshiftShares)).toFixed(4) : '0'}</p>
            </div>
          </div>
        )}

        {/* Price */}
        {price && (
          <div className="bg-gray-800/40 rounded-xl p-4 mb-8 border border-gray-700 flex justify-between items-center">
            <span className="text-gray-400">FLR Price</span>
            <span className="text-xl font-bold text-green-400">${Number(formatEther(price)).toFixed(4)}</span>
          </div>
        )}

        {/* Deposit FXRP */}
        <div className="bg-gray-800/40 rounded-xl p-6 mb-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>💰</span> Deposit FXRP
          </h2>
          <div className="flex gap-4 flex-wrap">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Amount in FXRP"
              className="flex-1 min-w-[200px] bg-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleDeposit}
              disabled={!isConnected || !depositAmount}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-6 py-2.5 rounded-lg transition disabled:opacity-50 font-medium"
            >
              Deposit
            </button>
          </div>
        </div>

        {/* Firelight Vault */}
        <div className="bg-gray-800/40 rounded-xl p-6 mb-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>🔥</span> Firelight Vault <span className="text-sm text-green-400 font-normal">(Yield)</span>
          </h2>
          <div className="flex gap-4 flex-wrap">
            <input
              type="number"
              value={firelightAmount}
              onChange={(e) => setFirelightAmount(e.target.value)}
              placeholder="Amount in FXRP"
              className="flex-1 min-w-[200px] bg-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleFirelightDeposit}
              disabled={!isConnected || !firelightAmount}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-6 py-2.5 rounded-lg transition disabled:opacity-50 font-medium"
            >
              Deposit
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">Earn yield through FAssets system. Deposits processed at specific intervals.</p>
        </div>

        {/* Upshift Vault */}
        <div className="bg-gray-800/40 rounded-xl p-6 mb-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>⬆️</span> Upshift Vault <span className="text-sm text-blue-400 font-normal">(Yield + Flexible)</span>
          </h2>
          <div className="flex gap-4 flex-wrap">
            <input
              type="number"
              value={upshiftAmount}
              onChange={(e) => setUpshiftAmount(e.target.value)}
              placeholder="Amount in FXRP"
              className="flex-1 min-w-[200px] bg-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleUpshiftDeposit}
              disabled={!isConnected || !upshiftAmount}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-6 py-2.5 rounded-lg transition disabled:opacity-50 font-medium"
            >
              Deposit
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">Instant or requested redemptions. Lower fees for requested redemptions after lag period.</p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-800 pt-6">
          <p>Deployed on <span className="text-orange-400">Coston2</span> | Contract: <span className="font-mono">{CONTRACT_ADDRESS.slice(0, 12)}...{CONTRACT_ADDRESS.slice(-8)}</span></p>
          <p className="mt-1">🏆 Flare Summer Signal Hackathon 2026</p>
        </div>
      </div>
    </div>
  );
}

export default App;
